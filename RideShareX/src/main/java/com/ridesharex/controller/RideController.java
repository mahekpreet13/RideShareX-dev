package com.ridesharex.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ridesharex.model.Ride;
import com.ridesharex.model.RideRequest;
import com.ridesharex.service.RideService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ridesharex.service.DriverMatchingService;
import com.ridesharex.repository.RideRequestRepository;

import com.ridesharex.repository.UserRepository;
import com.ridesharex.model.User;
import java.security.Principal;

@RestController
@RequestMapping("/rides")
public class RideController {
    private final RideService rideService;

    @Autowired
private DriverMatchingService driverMatchingService;

@Autowired
private RideRequestRepository rideRequestRepository;

@Autowired
private UserRepository userRepository;

    @Autowired
    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @PostMapping
    public Ride createRide(@RequestBody Ride ride) {
        return rideService.createRide(ride);
    }

    @GetMapping("/{rideId}")
    public Ride getRide(@PathVariable Long rideId) {
        return rideService.getRideById(rideId);
    }

    @GetMapping
    public List<Ride> getAllRides() {
        return rideService.getAllRides();
    }

   @GetMapping("/{rideId}/ride-requests")
public List<RideRequest> getRideRequestsForRide(@PathVariable Long rideId) {
    return rideService.getRideRequestsForRide(rideId);
}
 


@PostMapping("/{rideId}/ride-requests")
public RideRequest createRideRequest(
        @PathVariable Long rideId,
        @RequestParam Double pickupLat,
        @RequestParam Double pickupLng,
        java.security.Principal principal) {

    RideRequest request = rideService.createRideRequest(principal.getName(), rideId);

    // 🔥 SAVE PICKUP LOCATION
    request.setPickupLatitude(pickupLat);
    request.setPickupLongitude(pickupLng);

    Long driverId = driverMatchingService.matchDriverToRide(request.getId());

    if (driverId != null) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        request.setDriver(driver);
        request.setStatus("MATCHED");
    }

    return rideRequestRepository.save(request);
}

    @GetMapping("/active")
    public List<Ride> getActiveRides() {
        return rideService.getActiveRides();
    }
    @GetMapping("/my-requests")
public List<RideRequest> getMyRideRequests(java.security.Principal principal) {
    return rideService.getRideRequestsForUser(principal.getName());
}
@GetMapping("/driver/requests")
public List<RideRequest> getDriverRequests(Principal principal) {

    User driver = userRepository.findByUsername(principal.getName())
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    // 🚨 BLOCK non-drivers
    if (!"DRIVER".equals(driver.getRole())) {
        throw new RuntimeException("Access denied: Not a driver");
    }

    return rideRequestRepository.findAll()
            .stream()
            .filter(r -> r.getStatus().equals("PENDING"))
            .toList();
}
@DeleteMapping("/ride-requests/{requestId}")
public String cancelRideRequest(@PathVariable Long requestId, java.security.Principal principal) {
    rideService.cancelRideRequest(requestId, principal.getName());
    return "Request cancelled";
}
@PutMapping("/ride-requests/{requestId}/status")
public RideRequest updateRequestStatus(
        @PathVariable Long requestId,
        @RequestParam String status,
        java.security.Principal principal) {

    return rideService.updateRideRequestStatus(requestId, status, principal.getName());
}


}
