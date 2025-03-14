package com.example.mega.auth.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 255, message = "Username must be between 3 and 255 characters")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Column(length = 50)
    private String role;

    @Column(name = "customer_id")
    private Integer customerId;

    @Column(name = "driver_id")
    private Integer driverId;

    @Column(columnDefinition = "varchar(255) default 'active'")
    private String status = "active";
}