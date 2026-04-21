package com.ridesharex.dto;

public class FareEstimateResponse {
    private double distanceKm;
    private int estimatedDurationMin;
    private double estimatedFare;

    public FareEstimateResponse(double distanceKm, int estimatedDurationMin, double estimatedFare) {
        this.distanceKm = distanceKm;
        this.estimatedDurationMin = estimatedDurationMin;
        this.estimatedFare = estimatedFare;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public int getEstimatedDurationMin() {
        return estimatedDurationMin;
    }

    public double getEstimatedFare() {
        return estimatedFare;
    }
}