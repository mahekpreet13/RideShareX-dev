package com.ridesharex.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.ridesharex.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);
     boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.isDriverAvailable = true")
    List<User> findByRoleAndIsDriverAvailableTrue(String role);
}