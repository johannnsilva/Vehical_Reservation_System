package com.example.mega.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class DriverDTO {

    private Integer driverId;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    @NotBlank(message = "License number cannot be blank")
    @Size(max = 255, message = "License number cannot exceed 255 characters")
    private String licenseNumber;

    @NotBlank(message = "Phone number cannot be blank")
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    private String phoneNumber;

    @Size(max = 255, message = "Status cannot exceed 255 characters")
    private String status;

    private Integer userId;
    private String profilePicturePath;
}