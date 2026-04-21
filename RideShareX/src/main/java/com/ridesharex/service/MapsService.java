package com.ridesharex.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MapsService {

    @Value("${ors.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public MapsService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String getRoute(double dLat, double dLng, double uLat, double uLng) {
       
        String url = "https://api.openrouteservice.org/v2/directions/driving-car"
                + "?api_key=" + apiKey
                + "&start=" + dLng + "," + dLat
                + "&end=" + uLng + "," + uLat;

        return restTemplate.getForObject(url, String.class);
    }
}