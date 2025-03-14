package com.example.mega.dto;

import lombok.Data;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BillDTO {

    private Integer billId;

    private Integer bookingId;

    @NotNull(message = "Total amount cannot be null")
    private BigDecimal totalAmount;

    private BigDecimal taxAmount;

    private BigDecimal discountAmount;

    private String paymentStatus;

    private String paymentMethod;

    private LocalDateTime billDate;
}