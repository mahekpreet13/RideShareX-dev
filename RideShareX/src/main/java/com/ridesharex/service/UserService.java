package com.ridesharex.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ridesharex.model.RideRequest;
import com.ridesharex.model.User;
import com.ridesharex.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Create a new user
   public User createUser(User user) {

    System.out.println("Creating user: " + user.getUsername());

    // ✅ FIX: use Optional properly
    if (userRepository.findByUsername(user.getUsername()).isPresent()) {
        throw new IllegalArgumentException("Username already exists");
    }

    // ✅ Optional email check (recommended)
    if (user.getEmail() != null && userRepository.existsByEmail(user.getEmail())) {
        throw new IllegalArgumentException("Email already exists");
    }

    // ✅ encode password
    user.setPassword(passwordEncoder.encode(user.getPassword()));

    // ✅ role default
    if (user.getRole() == null || user.getRole().isEmpty()) {
        user.setRole("USER");
    }

    // ✅ driver setup
    if ("DRIVER".equals(user.getRole())) {
        user.setIsDriverAvailable(true);
    }

    return userRepository.save(user);
}

    // Retrieve a user by ID
    public User getUserById(Long userId) {
        return userRepository.findById(userId).orElse(null);
    }

    // Update user information
    public User updateUser(Long userId, User updatedUser) {
        User existingUser = userRepository.findById(userId).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            }

            return userRepository.save(existingUser);
        }
        return null;
    }

    // Delete a user by ID
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    public List<RideRequest> getUserRideRequests(Long userId) {
        return null;
    }

    public User updateDriverLocation(String username, Double latitude, Double longitude) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (user == null) {
        throw new IllegalArgumentException("User not found");
    }

    user.setCurrentLatitude(latitude);
    user.setCurrentLongitude(longitude);
    user.setIsDriverAvailable(true);

    return userRepository.save(user);
}

public User getDriverByUsername(String username) {
    User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

    if (user == null) {
        throw new IllegalArgumentException("User not found");
    }

    return user;
}
}