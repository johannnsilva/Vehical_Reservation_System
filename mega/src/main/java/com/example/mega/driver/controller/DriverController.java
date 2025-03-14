package com.example.mega.driver.controller;

import com.example.mega.auth.model.User;
import com.example.mega.auth.service.AuthService;
import com.example.mega.customer.service.CustomerService;
import com.example.mega.driver.service.DriverService;
import com.example.mega.dto.DriverDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/drivers")
public class DriverController {
    @Autowired
    private DriverService driverService;
    @Autowired
    private AuthService authService;

    @Autowired
    private CustomerService customerService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or (!hasRole('ROLE_CUSTOMER') and !@driverService.hasDriverProfile())")
    public ResponseEntity<?> createDriver(@Valid @ModelAttribute DriverDTO driverDTO, @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            Optional<User> userOptional = authService.getUserByUsername(currentUsername);
            if(!userOptional.isPresent()){
                return new ResponseEntity<>("user does not exist", HttpStatus.BAD_REQUEST);
            }
            User user = userOptional.get();

            if (driverDTO == null) {
                return new ResponseEntity<>("Driver data cannot be null", HttpStatus.BAD_REQUEST);
            }

            driverDTO.setUserId(user.getId());
            DriverDTO createdDriver = driverService.createDriver(driverDTO, profilePicture);
            return new ResponseEntity<>(createdDriver, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating driver", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DRIVER','ROLE_CUSTOMER')")
    public ResponseEntity<?> getDriverById(@PathVariable Integer id) {
        try {
            if (id == null) {
                return new ResponseEntity<>("Driver ID cannot be null", HttpStatus.BAD_REQUEST);
            }

            Optional<DriverDTO> driver = driverService.getDriverById(id);
            return driver.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting driver by ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/license/{licenseNumber}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DRIVER','ROLE_CUSTOMER')")
    public ResponseEntity<?> getDriverByLicenseNumber(@PathVariable String licenseNumber) {
        try {
            if (licenseNumber == null || licenseNumber.isEmpty()) {
                return new ResponseEntity<>("License number cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Optional<DriverDTO> driver = driverService.getDriverByLicenseNumber(licenseNumber);
            return driver.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting driver by license number", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> updateDriver(@PathVariable Integer id, @Valid @ModelAttribute DriverDTO driverDTO, @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            if (id == null) {
                return new ResponseEntity<>("Driver ID cannot be null", HttpStatus.BAD_REQUEST);
            }

            if (driverDTO == null) {
                return new ResponseEntity<>("Driver data cannot be null", HttpStatus.BAD_REQUEST);
            }

            DriverDTO updatedDriver = driverService.updateDriver(id, driverDTO, profilePicture);
            return ResponseEntity.ok(updatedDriver);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating driver", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteDriver(@PathVariable Integer id) {
        try {
            if (id == null) {
                return new ResponseEntity<>("Driver ID cannot be null", HttpStatus.BAD_REQUEST);
            }

            driverService.deleteDriver(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting driver", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> getAllDrivers() {
        try {
            List<DriverDTO> drivers = driverService.getAllDrivers();
            return ResponseEntity.ok(drivers);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting all drivers", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getDriversByStatus(@PathVariable String status) {
        try {
            if (status == null || status.isEmpty()) {
                return new ResponseEntity<>("Status cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            List<DriverDTO> drivers = driverService.getDriversByStatus(status);
            return ResponseEntity.ok(drivers);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting drivers by status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}