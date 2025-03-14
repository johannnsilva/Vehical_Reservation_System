package com.example.mega.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class VehicleDTO {

    private Integer vehicleId;

    @NotBlank(message = "Registration number cannot be blank")
    @Size(max = 255, message = "Registration number cannot exceed 255 characters")
    private String registrationNumber;

    @NotBlank(message = "Make cannot be blank")
    @Size(max = 255, message = "Make cannot exceed 255 characters")
    private String make;

    @NotBlank(message = "Model cannot be blank")
    @Size(max = 255, message = "Model cannot exceed 255 characters")
    private String model;

    private Integer year;

    @NotBlank(message = "Type cannot be blank")
    @Size(max = 255, message = "Type cannot exceed 255 characters")
    private String type;

    @Size(max = 255, message = "Status cannot exceed 255 characters")
    private String status;

    private Integer currentDriverId;

     private String vehiclePicturePath;
}