package com.ridesharex.model;

import java.time.LocalDateTime;
import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "ride_requests")
public class RideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride requestedRide;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User requestingUser;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    private String status;

    @Column(name = "pickup_latitude")
    private Double pickupLatitude;

    @Column(name = "pickup_longitude")
    private Double pickupLongitude;

    // GETTERS & SETTERS

    public Long getId() { return id; }

    public Ride getRequestedRide() { return requestedRide; }
    public void setRequestedRide(Ride requestedRide) { this.requestedRide = requestedRide; }

    public User getRequestingUser() { return requestingUser; }
    public void setRequestingUser(User requestingUser) { this.requestingUser = requestingUser; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }

    public Double getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }

    public Double getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }
}