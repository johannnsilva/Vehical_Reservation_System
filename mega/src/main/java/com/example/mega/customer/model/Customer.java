package com.example.mega.customer.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;


    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    @Size(max = 255, message = "Address cannot exceed 255 characters")
    private String address;

    @NotBlank(message = "NIC cannot be blank")
    @Size(max = 255, message = "NIC cannot exceed 255 characters")
    @Column(unique = true)
    private String nic;

    @NotBlank(message = "Phone number cannot be blank")
    @Size(max = 20, message = "Phone number cannot exceed 20 characters")
    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "profile_picture_path")
    private String profilePicturePath;
}