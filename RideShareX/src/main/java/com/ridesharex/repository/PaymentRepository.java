package com.ridesharex.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ridesharex.model.Payment;
import com.ridesharex.model.RideRequest;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByRideRequest(RideRequest rideRequest);
}