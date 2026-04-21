package com.ridesharex.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.ridesharex.dto.RouteEstimateRequest;
import com.ridesharex.dto.RouteEstimateResponse;

@Service
public class RouteService {

    private final RestTemplate restTemplate = new RestTemplate();

    public RouteEstimateResponse estimateRouteAndFare(RouteEstimateRequest request) {
        double[] originCoords = geocodeAddress(request.getOrigin());
        double[] destinationCoords = geocodeAddress(request.getDestination());

        Map route = getOsrmRoute(originCoords, destinationCoords);

        Number distanceMeters = (Number) route.get("distance");
        Number durationSeconds = (Number) route.get("duration");

        double distanceKm = Math.round((distanceMeters.doubleValue() / 1000.0) * 100.0) / 100.0;
        int durationMin = (int) Math.ceil(durationSeconds.doubleValue() / 60.0);

        double fare = calculateFare(distanceKm, durationMin);

        return new RouteEstimateResponse(distanceKm, durationMin, fare);
    }

    private double[] geocodeAddress(String address) {
        String encoded = URLEncoder.encode(address, StandardCharsets.UTF_8);
        String url = "https://nominatim.openstreetmap.org/search?q=" + encoded + "&format=json&limit=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "RideShareX/1.0 (student project)");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<List> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                entity,
                List.class
        );

        List results = response.getBody();

        if (results == null || results.isEmpty()) {
            throw new IllegalArgumentException("Could not find location: " + address);
        }

        Map first = (Map) results.get(0);

        double lat = Double.parseDouble((String) first.get("lat"));
        double lon = Double.parseDouble((String) first.get("lon"));

        return new double[]{lat, lon};
    }

    private Map getOsrmRoute(double[] origin, double[] destination) {
        String url = String.format(
                "https://router.project-osrm.org/route/v1/driving/%f,%f;%f,%f?overview=false",
                origin[1], origin[0], destination[1], destination[0]
        );

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        Map body = response.getBody();

        if (body == null || body.get("routes") == null) {
            throw new IllegalArgumentException("No route found");
        }

        List routes = (List) body.get("routes");
        if (routes.isEmpty()) {
            throw new IllegalArgumentException("No route found");
        }

        return (Map) routes.get(0);
    }

    private double calculateFare(double distanceKm, int durationMin) {
        double baseFare = 50.0;
        double perKm = 12.0;
        double perMin = 2.0;

        double fare = baseFare + (distanceKm * perKm) + (durationMin * perMin);
        return Math.round(fare * 100.0) / 100.0;
    }
}