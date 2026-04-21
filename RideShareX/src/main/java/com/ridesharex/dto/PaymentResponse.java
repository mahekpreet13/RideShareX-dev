package com.ridesharex.dto;

public class PaymentResponse {
    private Long paymentId;
    private String paymentStatus;
    private String transactionId;
    private Double amount;

    public PaymentResponse(Long paymentId, String paymentStatus, String transactionId, Double amount) {
        this.paymentId = paymentId;
        this.paymentStatus = paymentStatus;
        this.transactionId = transactionId;
        this.amount = amount;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public Double getAmount() {
        return amount;
    }
}