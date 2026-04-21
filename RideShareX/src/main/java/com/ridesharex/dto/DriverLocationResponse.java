package com.ridesharex.dto;

public class DriverLocationResponse {
    private Double latitude;
    private Double longitude;
    private String driverUsername;

    public DriverLocationResponse(Double latitude, Double longitude, String driverUsername) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.driverUsername = driverUsername;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public String getDriverUsername() {
        return driverUsername;
    }
}