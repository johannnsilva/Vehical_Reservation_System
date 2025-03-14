package com.example.mega.booking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Data;

@Data
@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Integer bookingId;

    @NotBlank(message = "Booking number cannot be blank")
    @Size(max = 255, message = "Booking number cannot exceed 255 characters")
    @Column(name = "booking_number", unique = true)
    private String bookingNumber;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "vehicle_id")
    private Integer vehicleId;

    @Column(name = "driver_id")
    private Integer driverId;

    @NotBlank(message = "Pickup address cannot be blank")
    @Size(max = 255, message = "Pickup address cannot exceed 255 characters")
    @Column(name = "pickup_address")
    private String pickupAddress;

    @NotBlank(message = "Destination address cannot be blank")
    @Size(max = 255, message = "Destination address cannot exceed 255 characters")
    @Column(name = "destination_address")
    private String destinationAddress;

    @Column(name = "pickup_time")
    private LocalDateTime pickupTime;

    @Column(name = "dropoff_time")
    private LocalDateTime dropoffTime;

    @Size(max = 255, message = "Status cannot exceed 255 characters")
    private String status;

    private BigDecimal distance;

    private BigDecimal amount;

    @Column(name = "booking_date")
    private LocalDateTime bookingDate;
}