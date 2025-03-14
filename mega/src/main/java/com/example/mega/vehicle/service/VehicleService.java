package com.example.mega.vehicle.service;

import com.example.mega.dto.VehicleDTO;
import com.example.mega.vehicle.model.Vehicle;
import com.example.mega.vehicle.repository.VehicleRepository;
import com.example.mega.util.ImageStorageUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private ImageStorageUtil imageStorageUtil;


    @Value("${upload.directory}") 
    private String uploadPath;


    public VehicleDTO createVehicle(VehicleDTO vehicleDTO, MultipartFile vehiclePicture) {
        try {
            if (vehicleDTO == null) {
                throw new IllegalArgumentException("Vehicle object cannot be null");
            }
            if (vehicleRepository.findByRegistrationNumber(vehicleDTO.getRegistrationNumber()).isPresent()) {
                throw new IllegalArgumentException("Registration number already exists");
            }

            Vehicle vehicle = modelMapper.map(vehicleDTO, Vehicle.class);

            if (vehiclePicture != null && !vehiclePicture.isEmpty()) {
                String vehiclePicturePath = imageStorageUtil.saveImage(vehiclePicture, uploadPath);
                vehicle.setVehiclePicturePath(vehiclePicturePath);
            }

            Vehicle savedVehicle = vehicleRepository.save(vehicle);
            return modelMapper.map(savedVehicle, VehicleDTO.class);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error creating vehicle: " + e.getMessage());
            throw new RuntimeException("Error creating vehicle", e);
        }
    }

    public Optional<VehicleDTO> getVehicleById(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Vehicle ID cannot be null");
            }
            Optional<Vehicle> vehicle = vehicleRepository.findById(id);
            return vehicle.map(b -> modelMapper.map(b, VehicleDTO.class));
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting vehicle by ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<VehicleDTO> getVehicleByRegistrationNumber(String registrationNumber) {
        try {
            if (registrationNumber == null || registrationNumber.isEmpty()) {
                throw new IllegalArgumentException("Registration number cannot be null or empty");
            }
            Optional<Vehicle> vehicle = vehicleRepository.findByRegistrationNumber(registrationNumber);
            return vehicle.map(b -> modelMapper.map(b, VehicleDTO.class));
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting vehicle by registration number: " + e.getMessage());
            return Optional.empty();
        }
    }

    public VehicleDTO updateVehicle(Integer id, VehicleDTO vehicleDTO, MultipartFile vehiclePicture) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Vehicle ID cannot be null");
            }
            if (vehicleDTO == null) {
                throw new IllegalArgumentException("Vehicle object cannot be null");
            }
            Optional<Vehicle> existingVehicle = vehicleRepository.findById(id);
            if (existingVehicle.isPresent()) {
                Vehicle vehicle = modelMapper.map(vehicleDTO, Vehicle.class);
                vehicle.setVehicleId(id);

                if (vehiclePicture != null && !vehiclePicture.isEmpty()) {
                    String vehiclePicturePath = imageStorageUtil.saveImage(vehiclePicture,uploadPath);
                    vehicle.setVehiclePicturePath(vehiclePicturePath);
                }


                Vehicle updatedVehicle = vehicleRepository.save(vehicle);
                return modelMapper.map(updatedVehicle, VehicleDTO.class);
            } else {
                throw new IllegalArgumentException("Vehicle not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating vehicle: " + e.getMessage());
            throw new RuntimeException("Error updating vehicle", e);
        }
    }

    @Transactional
    public void deleteVehicle(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Vehicle ID cannot be null");
            }

            Optional<Vehicle> vehicleOptional = vehicleRepository.findById(id);
            if (vehicleOptional.isPresent()) {
                Vehicle vehicle = vehicleOptional.get();
                String imagePath = vehicle.getVehiclePicturePath();

                // Delete the vehicle first to avoid issues if image deletion fails
                vehicleRepository.deleteById(id);

                // Now delete the image if a path exists
                if (imagePath != null && !imagePath.isEmpty()) {
                    imageStorageUtil.deleteImage(imagePath);
                }
            } else {
                throw new IllegalArgumentException("Vehicle not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e; // Re-throw the exception to be handled by the caller
        } catch (Exception e) {
            System.err.println("Error deleting vehicle: " + e.getMessage());
            throw new RuntimeException("Error deleting vehicle", e); // Wrap and re-throw
        }
    }

    public List<VehicleDTO> getAllVehicles() {
        try {
            List<Vehicle> vehicles = vehicleRepository.findAll();
            return vehicles.stream()
                    .map(vehicle -> modelMapper.map(vehicle, VehicleDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting all vehicles: " + e.getMessage());
            return List.of();
        }
    }

    public List<VehicleDTO> getVehiclesByStatus(String status) {
        try {
            if (status == null || status.isEmpty()) {
                throw new IllegalArgumentException("Status cannot be null or empty");
            }
            List<Vehicle> vehicles = vehicleRepository.findByStatus(status);
            return vehicles.stream()
                    .map(vehicle -> modelMapper.map(vehicle, VehicleDTO.class))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return List.of();
        } catch (Exception e) {
            System.err.println("Error getting vehicles by status: " + e.getMessage());
            return List.of();
        }
    }
     public List<VehicleDTO> getVehiclesByCurrentDriverId(Integer currentDriverId) {
        try {
            if (currentDriverId == null) {
                throw new IllegalArgumentException("currentDriverId cannot be null");
            }
            List<Vehicle> vehicles = vehicleRepository.findByCurrentDriverId(currentDriverId);
            // Log the number of vehicles found for debugging
            System.out.println("Number of vehicles found for driver ID " + currentDriverId + ": " + vehicles.size());

            return vehicles.stream()
                    .map(vehicle -> {
                        // Add null check before mapping to prevent NullPointerException
                        if (vehicle == null) {
                            System.err.println("Null vehicle found in list for driver ID: " + currentDriverId);
                            return null; // Skip null vehicles
                        }
                        return modelMapper.map(vehicle, VehicleDTO.class);
                    })
                    .filter(vehicleDTO -> vehicleDTO != null) // Remove null DTOs from the stream
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return List.of();
        } catch (Exception e) {
            System.err.println("Error getting vehicles by current driver ID: " + e.getMessage());
            return List.of();
        }
    }
}