package com.ridesharex.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ridesharex.dto.PaymentRequest;
import com.ridesharex.dto.PaymentResponse;
import com.ridesharex.model.Payment;
import com.ridesharex.model.RideRequest;
import com.ridesharex.repository.PaymentRepository;
import com.ridesharex.repository.RideRequestRepository;
import com.ridesharex.repository.RideRepository;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final RideRequestRepository rideRequestRepository;
    private final RideRepository rideRepository;

    @Autowired
    public PaymentService(PaymentRepository paymentRepository,
                          RideRequestRepository rideRequestRepository,
                          RideRepository rideRepository) {
        this.paymentRepository = paymentRepository;
        this.rideRequestRepository = rideRequestRepository;
        this.rideRepository = rideRepository;
    }

    public PaymentResponse makeMockPayment(PaymentRequest request) {

        System.out.println("=== PAYMENT DEBUG ===");

        RideRequest rideRequest = rideRequestRepository.findById(request.getRideRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Ride request not found"));

        System.out.println("RideRequest ID: " + rideRequest.getId());

        if (rideRequest.getRequestedRide() == null) {
            throw new IllegalArgumentException("Ride is NULL inside RideRequest");
        }

        Long rideId = rideRequest.getRequestedRide().getId();
        System.out.println("Ride ID: " + rideId);

        Double fare = rideRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"))
                .getEstimatedFare();

        System.out.println("Fare: " + fare);

        if (fare == null) {
            throw new IllegalArgumentException("Fare is NULL");
        }

        Payment existing = paymentRepository.findByRideRequest(rideRequest);
        if (existing != null) {
            throw new IllegalArgumentException("Payment already exists");
        }

        Payment payment = new Payment();
        payment.setRideRequest(rideRequest);
        payment.setAmount(fare);
        payment.setCurrency("INR");
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setPaymentStatus("PAID");
        payment.setTransactionId("MOCK-" + UUID.randomUUID());

        Payment saved = paymentRepository.save(payment);

        return new PaymentResponse(
                saved.getId(),
                saved.getPaymentStatus(),
                saved.getTransactionId(),
                saved.getAmount()
        );
    }
}