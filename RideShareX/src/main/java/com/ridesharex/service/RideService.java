package com.ridesharex.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ridesharex.model.Ride;
import com.ridesharex.model.RideRequest;
import com.ridesharex.model.User;
import com.ridesharex.repository.RideRepository;
import com.ridesharex.repository.RideRequestRepository;
import com.ridesharex.repository.UserRepository;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;
    private final RideRequestRepository rideRequestRepository;

    @Autowired
    public RideService(RideRepository rideRepository,
                       UserRepository userRepository,
                       RideRequestRepository rideRequestRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
        this.rideRequestRepository = rideRequestRepository;
    }

    public Ride createRide(Ride ride) {
        if (ride.getOrigin() == null || ride.getDestination() == null) {
            throw new IllegalArgumentException("Origin and Destination cannot be empty.");
        }
        // 🔥 Calculate fare inside backend
    double fare = calculateFare(ride.getDistanceKm(), ride.getDurationMin());
    ride.setEstimatedFare(fare);

        ride.setIsActive(true);
        return rideRepository.save(ride);
    }

    private double calculateFare(double distanceKm, int durationMin) {
    double baseFare = 50.0;
    double perKm = 12.0;
    double perMin = 2.0;

    double fare = baseFare + (distanceKm * perKm) + (durationMin * perMin);

    return Math.round(fare * 100.0) / 100.0;
}

    public Ride getRideById(Long rideId) {
        return rideRepository.findById(rideId).orElse(null);
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    public List<Ride> getActiveRides() {
        return rideRepository.findAll()
                .stream()
                .filter(Ride::getIsActive)
                .collect(Collectors.toList());
    }

    public List<RideRequest> getRideRequestsForRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));

        return rideRequestRepository.findByRequestedRide(ride);
    }

    // 🔥 NEW — request ride using JWT username
    public RideRequest createRideRequest(String username, Long rideId) {
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));

        if (rideRequestRepository.existsByRequestingUserAndRequestedRide(user, ride)) {
            throw new IllegalArgumentException("User already requested this ride");
        }

        RideRequest request = new RideRequest();
        request.setRequestingUser(user);
        request.setRequestedRide(ride);

        request.setPickupLatitude(17.3850);   // TEMP HARDCODE
request.setPickupLongitude(78.4867); 
    
        request.setStatus("PENDING");

        return rideRequestRepository.save(request);
    }

    // 🔥 NEW — get my requests
    public List<RideRequest> getRideRequestsForUser(String username) {
        User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        return rideRequestRepository.findByRequestingUser(user);
    }

    // 🔥 NEW — cancel request
    public void cancelRideRequest(Long requestId, String username) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));

        if (!request.getRequestingUser().getUsername().equals(username)) {
            throw new IllegalArgumentException("Not allowed");
        }

        rideRequestRepository.delete(request);
    }
public RideRequest updateRideRequestStatus(Long requestId, String status, String driverUsername) {

    RideRequest request = rideRequestRepository.findById(requestId)
            .orElseThrow(() -> new IllegalArgumentException("Request not found"));

    User driver = userRepository.findByUsername(driverUsername)
            .orElseThrow(() -> new RuntimeException("Driver not found"));

    if (!"DRIVER".equals(driver.getRole())) {
    throw new RuntimeException("Only drivers can update ride status");
}

    // ✅ Only assigned driver can act
    if (request.getDriver() == null || !request.getDriver().getId().equals(driver.getId())) {
        throw new IllegalArgumentException("Not your request");
    }

    // ✅ Prevent multiple acceptance
    if (status.equals("ACCEPTED") && request.getStatus().equals("ACCEPTED")) {
        throw new IllegalStateException("Ride already accepted by a driver");
    }

    // ✅ Validate allowed status
    if (!java.util.List.of(
            "ACCEPTED",
            "REJECTED",
            "DRIVER_ARRIVING",
            "IN_PROGRESS",
            "COMPLETED"
    ).contains(status)) {
        throw new IllegalArgumentException("Invalid status");
    }

    // ✅ If accepted → lock driver
    if (status.equals("ACCEPTED")) {
        driver.setIsDriverAvailable(false);
        userRepository.save(driver);
    }

    if (status.equals("COMPLETED")) {
    driver.setIsDriverAvailable(true);
    userRepository.save(driver);
}

    request.setStatus(status);

    return rideRequestRepository.save(request);
}

}