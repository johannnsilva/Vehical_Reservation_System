package com.example.mega.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class BookingDTO {

    private Integer bookingId;

    @NotBlank(message = "Booking number cannot be blank")
    @Size(max = 255, message = "Booking number cannot exceed 255 characters")
    private String bookingNumber;

    private Integer customerId;

    private Integer vehicleId;

    private Integer driverId;

    @NotBlank(message = "Pickup address cannot be blank")
    @Size(max = 255, message = "Pickup address cannot exceed 255 characters")
    private String pickupAddress;

    @NotBlank(message = "Destination address cannot be blank")
    @Size(max = 255, message = "Destination address cannot exceed 255 characters")
    private String destinationAddress;

    private LocalDateTime pickupTime;

    private LocalDateTime dropoffTime;

    @Size(max = 255, message = "Status cannot exceed 255 characters")
    private String status;

    private BigDecimal distance;

    private BigDecimal amount;

    private LocalDateTime bookingDate;
}