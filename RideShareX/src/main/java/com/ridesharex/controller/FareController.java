package com.ridesharex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ridesharex.dto.FareEstimateRequest;
import com.ridesharex.dto.FareEstimateResponse;
import com.ridesharex.service.FareService;

@RestController
@RequestMapping("/fare")
public class FareController {

    private final FareService fareService;

    @Autowired
    public FareController(FareService fareService) {
        this.fareService = fareService;
    }

    @PostMapping("/estimate")
    public FareEstimateResponse estimateFare(@RequestBody FareEstimateRequest request) {
        return fareService.estimateFare(request);
    }
}