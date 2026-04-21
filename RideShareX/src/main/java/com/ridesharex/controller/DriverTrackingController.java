package com.ridesharex.controller;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.ridesharex.dto.DriverLocationRequest;
import com.ridesharex.dto.DriverLocationResponse;
import com.ridesharex.model.User;
import com.ridesharex.service.UserService;

@RestController
@RequestMapping("/drivers")
public class DriverTrackingController {

    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public DriverTrackingController(UserService userService,
                                    SimpMessagingTemplate messagingTemplate) {
        this.userService = userService;
        this.messagingTemplate = messagingTemplate;
    }

    @PutMapping("/me/location")
    public DriverLocationResponse updateMyLocation(@RequestBody DriverLocationRequest request,
                                                   Principal principal) {

        User user = userService.updateDriverLocation(
                principal.getName(),
                request.getLatitude(),
                request.getLongitude()
        );

        DriverLocationResponse response = new DriverLocationResponse(
                user.getCurrentLatitude(),
                user.getCurrentLongitude(),
                user.getUsername()
        );

        messagingTemplate.convertAndSend(
                "/topic/driver-location/" + user.getUsername(),
                response
        );

        return response;
    }

    @GetMapping("/{username}/location")
    public DriverLocationResponse getDriverLocation(@PathVariable String username) {
        User user = userService.getDriverByUsername(username);

        return new DriverLocationResponse(
                user.getCurrentLatitude(),
                user.getCurrentLongitude(),
                user.getUsername()
        );
    }
}