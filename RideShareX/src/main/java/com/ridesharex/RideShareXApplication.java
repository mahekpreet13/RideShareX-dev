package com.ridesharex;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class RideShareXApplication {

    public static void main(String[] args) {
         System.out.println(
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
            .encode("password")
        );

        SpringApplication.run(RideShareXApplication.class, args);
    }
}
