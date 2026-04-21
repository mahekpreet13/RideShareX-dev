package com.ridesharex.dto;

public class RouteEstimateResponse {
    private double distanceKm;
    private int durationMin;
    private double estimatedFare;

    public RouteEstimateResponse(double distanceKm, int durationMin, double estimatedFare) {
        this.distanceKm = distanceKm;
        this.durationMin = durationMin;
        this.estimatedFare = estimatedFare;
    }

    public double getDistanceKm() {
        return distanceKm;
    }

    public int getDurationMin() {
        return durationMin;
    }

    public double getEstimatedFare() {
        return estimatedFare;
    }
}