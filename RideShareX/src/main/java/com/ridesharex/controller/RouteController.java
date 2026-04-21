package com.ridesharex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ridesharex.dto.RouteEstimateRequest;
import com.ridesharex.dto.RouteEstimateResponse;
import com.ridesharex.service.RouteService;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteService routeService;

    @Autowired
    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping("/estimate")
    public RouteEstimateResponse estimateRoute(@RequestBody RouteEstimateRequest request) {
        return routeService.estimateRouteAndFare(request);
    }
}
