package com.ridesharex.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ridesharex.model.RideRequest;
import com.ridesharex.model.User;
import com.ridesharex.repository.RideRequestRepository;
import com.ridesharex.repository.UserRepository;

@Service
public class DriverMatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RideRequestRepository rideRequestRepository;

    public Long matchDriverToRide(Long rideRequestId) {

        RideRequest rideRequest = rideRequestRepository.findById(rideRequestId)
                .orElseThrow(() -> new RuntimeException("Ride request not found"));

        System.out.println("===== DRIVER MATCHING START =====");
        System.out.println("Matching ride: " + rideRequest.getId());
        System.out.println("Pickup: " + rideRequest.getPickupLatitude() + ", " + rideRequest.getPickupLongitude());

       List<User> drivers = userRepository.findByRoleAndIsDriverAvailableTrue("DRIVER");

        System.out.println("Drivers found: " + drivers.size());

        if (drivers.isEmpty()) {
            System.out.println("❌ No drivers available");
            return null;
        }

        double minDistance = Double.MAX_VALUE;
        Long bestDriverId = null;

        for (User driver : drivers) {

            System.out.println("Checking driver: " + driver.getUsername());

            if (driver.getCurrentLatitude() == null || driver.getCurrentLongitude() == null) {
                System.out.println("Skipping driver (no location)");
                continue;
            }

            if (rideRequest.getPickupLatitude() == null || rideRequest.getPickupLongitude() == null) {
                System.out.println("❌ Ride pickup location missing");
                continue;
            }

           double distance = calculateDistance(
    driver.getCurrentLatitude(),
    driver.getCurrentLongitude(),
    rideRequest.getPickupLatitude(),   // ✅ FIX
    rideRequest.getPickupLongitude()   // ✅ FIX
);

            System.out.println("Distance to driver: " + distance);

            if (distance < minDistance) {
                minDistance = distance;
                bestDriverId = driver.getId();
            }
        }

        System.out.println("✅ Selected Driver ID: " + bestDriverId);
        System.out.println("===== DRIVER MATCHING END =====");

        return bestDriverId;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}