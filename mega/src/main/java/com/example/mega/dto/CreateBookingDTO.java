package com.example.mega.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateBookingDTO {
    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;
    
    @NotBlank(message = "Destination address is required")
    private String destinationAddress;
    
    @NotNull(message = "Distance is required")
    private BigDecimal distance;
    
    private Integer driverId;
    
    @NotBlank(message = "Pickup time is required")
    private String pickupTime;
    
    private Integer vehicleId;
}