package com.example.mega.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class UserDTO {

    private Integer id;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 255, message = "Username must be between 3 and 255 characters")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @Size(max = 50, message = "Role cannot exceed 50 characters")
    private String role;

    private Integer customerId;

    private Integer driverId;

    private String status = "active";
}