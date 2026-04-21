package com.ridesharex.service;

import org.springframework.stereotype.Service;

import com.ridesharex.dto.FareEstimateRequest;
import com.ridesharex.dto.FareEstimateResponse;

@Service
public class FareService {

    private static final double BASE_FARE = 50.0;
    private static final double PER_KM_RATE = 12.0;
    private static final double PER_MIN_RATE = 2.0;

    public FareEstimateResponse estimateFare(FareEstimateRequest request) {
        if (request.getDistanceKm() < 0 || request.getEstimatedDurationMin() < 0) {
            throw new IllegalArgumentException("Distance and duration must be non-negative");
        }

        double estimatedFare =
                BASE_FARE
                + (request.getDistanceKm() * PER_KM_RATE)
                + (request.getEstimatedDurationMin() * PER_MIN_RATE);

        estimatedFare = Math.round(estimatedFare * 100.0) / 100.0;

        return new FareEstimateResponse(
                request.getDistanceKm(),
                request.getEstimatedDurationMin(),
                estimatedFare
        );
    }
}