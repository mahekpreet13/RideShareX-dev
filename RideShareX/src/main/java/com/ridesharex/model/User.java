package com.ridesharex.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;


import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", unique = true)
    private String username;

  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
@Column(name = "password")
private String password;

    @Column(name = "email")
    private String email;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "currentLatitude")
private Double currentLatitude;

@Column(name = "currentLongitude")
private Double currentLongitude;

@Column(name = "isDriverAvailable")
private Boolean isDriverAvailable;

@Column(name = "role")
private String role; // "DRIVER" or "USER"

    // Constructors

    // Getters
    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

     public String getPassword() {
     return password;
     }

    public String getEmail() {
        return email;
    }

    // Setters
    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getCurrentLatitude() {
    return currentLatitude;
}

public void setCurrentLatitude(Double currentLatitude) {
    this.currentLatitude = currentLatitude;
}

public Double getCurrentLongitude() {
    return currentLongitude;
}

public void setCurrentLongitude(Double currentLongitude) {
    this.currentLongitude = currentLongitude;
}

public Boolean getIsDriverAvailable() {
    return isDriverAvailable;
}

public void setIsDriverAvailable(Boolean isDriverAvailable) {
    this.isDriverAvailable = isDriverAvailable;
}

public String getRole() {
    return role;
}

public void setRole(String role) {
    this.role = role;
}

}
