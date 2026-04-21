package com.ridesharex.controller;

import com.ridesharex.service.MapsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/maps")
public class MapsController {

    private final MapsService mapsService;

    public MapsController(MapsService mapsService) {
        this.mapsService = mapsService;
    }

    @GetMapping("/route")
    public String getRoute(
            @RequestParam double driverLat,
            @RequestParam double driverLng,
            @RequestParam double userLat,
            @RequestParam double userLng
    ) {
        return mapsService.getRoute(driverLat, driverLng, userLat, userLng);
    }
}