package com.example.mega.driver.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "driver_id")
    private Integer driverId;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    @NotBlank(message = "License number cannot be blank")
    @Size(max = 255, message = "License number cannot exceed 255 characters")
    @Column(name = "license_number", unique = true)
    private String licenseNumber;

    @NotBlank(message = "Phone number cannot be blank")
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    @Column(name = "phone_number")
    private String phoneNumber;

    @Size(max = 255, message = "Status cannot exceed 255 characters")
    private String status;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "profile_picture_path")
    private String profilePicturePath;
}