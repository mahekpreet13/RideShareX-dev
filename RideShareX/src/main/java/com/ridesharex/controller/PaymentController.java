package com.ridesharex.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ridesharex.dto.PaymentRequest;
import com.ridesharex.dto.PaymentResponse;
import com.ridesharex.service.PaymentService;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/mock")
    public PaymentResponse makePayment(@RequestBody PaymentRequest request) {
        return paymentService.makeMockPayment(request);
    }
}