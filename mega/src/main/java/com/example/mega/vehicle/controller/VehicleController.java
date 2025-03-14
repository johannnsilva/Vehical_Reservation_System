package com.example.mega.vehicle.controller;

import com.example.mega.vehicle.service.VehicleService;
import com.example.mega.dto.VehicleDTO;
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

import com.example.mega.auth.service.AuthService;
import com.example.mega.auth.model.User;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> createVehicle(@Valid @ModelAttribute VehicleDTO vehicleDTO, @RequestParam(value = "vehiclePicture", required = false) MultipartFile vehiclePicture) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DRIVER"))) {

                String username = authentication.getName();
                Optional<User> userOptional = authService.getUserByUsername(username);
                if (!userOptional.isPresent()) {
                    return new ResponseEntity<>("User not found for username: " + username, HttpStatus.NOT_FOUND);
                }

                User user = userOptional.get();
                Integer driverId = user.getDriverId();

                if (vehicleDTO.getCurrentDriverId() == null || !vehicleDTO.getCurrentDriverId().equals(driverId)) {
                    return new ResponseEntity<>("Unauthorized: Driver ID in vehicle data does not match authenticated driver.", HttpStatus.FORBIDDEN);
                }
                vehicleDTO.setCurrentDriverId(driverId);
            }

            if (vehicleDTO == null) {
                return new ResponseEntity<>("Vehicle data cannot be null", HttpStatus.BAD_REQUEST);
            }


            VehicleDTO createdVehicle = vehicleService.createVehicle(vehicleDTO, vehiclePicture);
            return new ResponseEntity<>(createdVehicle, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating vehicle", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_DRIVER')")
    public ResponseEntity<?> getVehicleById(@PathVariable Integer id) {
        try {
            if (id == null) {
                return new ResponseEntity<>("Vehicle ID cannot be null", HttpStatus.BAD_REQUEST);
            }
            Optional<VehicleDTO> vehicle = vehicleService.getVehicleById(id);
            return vehicle.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting vehicle by ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/registration/{registrationNumber}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_DRIVER')")
    public ResponseEntity<?> getVehicleByRegistrationNumber(@PathVariable String registrationNumber) {
        try {
            if (registrationNumber == null || registrationNumber.isEmpty()) {
                return new ResponseEntity<>("Registration number cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            Optional<VehicleDTO> vehicle = vehicleService.getVehicleByRegistrationNumber(registrationNumber);
            return vehicle.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting vehicle by registration number", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')  or hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> updateVehicle(@PathVariable Integer id, @Valid @ModelAttribute VehicleDTO vehicleDTO, @RequestParam(value = "vehiclePicture", required = false) MultipartFile vehiclePicture) {
        try {
            if (id == null) {
                return new ResponseEntity<>("Vehicle ID cannot be null", HttpStatus.BAD_REQUEST);
            }

            if (vehicleDTO == null) {
                return new ResponseEntity<>("Vehicle data cannot be null", HttpStatus.BAD_REQUEST);
            }

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_DRIVER"))) {

                String username = authentication.getName();
                Optional<User> userOptional = authService.getUserByUsername(username);
                if (!userOptional.isPresent()) {
                    return new ResponseEntity<>("User not found for username: " + username, HttpStatus.NOT_FOUND);
                }

                User user = userOptional.get();
                Integer driverId = user.getDriverId();

                 if (vehicleDTO.getCurrentDriverId() == null || !vehicleDTO.getCurrentDriverId().equals(driverId)) {
                    return new ResponseEntity<>("Unauthorized: Driver ID in vehicle data does not match authenticated driver.", HttpStatus.FORBIDDEN);
                }

                vehicleDTO.setCurrentDriverId(driverId);
            }


            VehicleDTO updatedVehicle = vehicleService.updateVehicle(id, vehicleDTO, vehiclePicture);
            return ResponseEntity.ok(updatedVehicle);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating vehicle", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> deleteVehicle(@PathVariable Integer id) {
        try {
            if (id == null) {
                return new ResponseEntity<>("Vehicle ID cannot be null", HttpStatus.BAD_REQUEST);
            }

            vehicleService.deleteVehicle(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting vehicle", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getAllVehicles() {
        try {
            List<VehicleDTO> vehicles = vehicleService.getAllVehicles();
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting all vehicles", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

     @GetMapping("/driver")
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> getVehiclesByCurrentDriver() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            if (username == null || username.isEmpty()) {
                return new ResponseEntity<>("Username not found in security context", HttpStatus.BAD_REQUEST);
            }

            Optional<User> userOptional = authService.getUserByUsername(username);
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found for username: " + username, HttpStatus.NOT_FOUND);
            }

            User user = userOptional.get();
            Integer driverId = user.getDriverId();
            if (driverId == null) {
                return new ResponseEntity<>("Driver ID not found for user: " + username, HttpStatus.BAD_REQUEST);
            }

            List<VehicleDTO> vehicles = vehicleService.getVehiclesByCurrentDriverId(driverId);
            return ResponseEntity.ok(vehicles);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting vehicles for current driver: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER')")
    public ResponseEntity<?> getVehiclesByStatus(@PathVariable String status) {
        try {
            if (status == null || status.isEmpty()) {
                return new ResponseEntity<>("Status cannot be null or empty", HttpStatus.BAD_REQUEST);
            }

            List<VehicleDTO> vehicles = vehicleService.getVehiclesByStatus(status);
            return ResponseEntity.ok(vehicles);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting vehicles by status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}