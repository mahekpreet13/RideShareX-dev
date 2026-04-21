package com.ridesharex.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.ridesharex.model.User;
import com.ridesharex.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // 🔹 Fetch user from DB
       User user = userRepository.findByUsername(username)
        .orElseThrow(() -> new RuntimeException("User not found"));

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // 🔹 Convert DB user → Spring Security user
        return new CustomUserDetails(user);
    }
}