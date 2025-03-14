package com.example.mega.driver.service;

import com.example.mega.auth.model.User;
import com.example.mega.auth.repository.UserRepository;
import com.example.mega.driver.model.Driver;
import com.example.mega.driver.repository.DriverRepository;
import com.example.mega.dto.DriverDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;
import com.example.mega.util.ImageStorageUtil;
import org.springframework.beans.factory.annotation.Value;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ImageStorageUtil imageStorageUtil;

    @Value("${upload.directory}") 
    private String uploadPath;

    @Transactional
    public DriverDTO createDriver(DriverDTO driverDTO, MultipartFile profilePicture) {
        try {
            if (driverDTO == null) {
                throw new IllegalArgumentException("Driver object cannot be null");
            }
            if (driverRepository.findByLicenseNumber(driverDTO.getLicenseNumber()).isPresent()) {
                throw new IllegalArgumentException("License number already exists");
            }
            if (driverDTO.getUserId() == null) {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                String currentUsername = authentication.getName();
                Optional<User> user = userRepository.findByUsername(currentUsername);
                if(user.isPresent()) {
                    driverDTO.setUserId(user.get().getId());
                }

            }
            Driver driver = modelMapper.map(driverDTO, Driver.class);

            // Handle profile picture upload
            if (profilePicture != null && !profilePicture.isEmpty()) {
                String profilePicturePath = imageStorageUtil.saveImage(profilePicture, uploadPath);
                driver.setProfilePicturePath(profilePicturePath);
            }

            Driver savedDriver = driverRepository.save(driver);

            User user = userRepository.findById(driverDTO.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + driverDTO.getUserId()));

            user.setDriverId(savedDriver.getDriverId());
            userRepository.save(user);

            return modelMapper.map(savedDriver, DriverDTO.class);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error creating driver: " + e.getMessage());
            throw new RuntimeException("Error creating driver", e);
        }
    }

    public Optional<DriverDTO> getDriverById(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Driver ID cannot be null");
            }
            Optional<Driver> driver = driverRepository.findById(id);
            if (driver.isPresent()) {
                return Optional.of(modelMapper.map(driver.get(), DriverDTO.class));
            }
            return Optional.empty();

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting driver by ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<DriverDTO> getDriverByLicenseNumber(String licenseNumber) {
        try {
            if (licenseNumber == null || licenseNumber.isEmpty()) {
                throw new IllegalArgumentException("License number cannot be null or empty");
            }
            Optional<Driver> driver = driverRepository.findByLicenseNumber(licenseNumber);
            if (driver.isPresent()) {
                DriverDTO driverDTO = modelMapper.map(driver.get(), DriverDTO.class);
                return Optional.of(driverDTO);
            }
            return Optional.empty();

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting driver by license number: " + e.getMessage());
            return Optional.empty();
        }
    }

    public DriverDTO updateDriver(Integer id, DriverDTO driverDTO, MultipartFile profilePicture) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Driver ID cannot be null");
            }
            if (driverDTO == null) {
                throw new IllegalArgumentException("Driver object cannot be null");
            }
            Optional<Driver> existingDriver = driverRepository.findById(id);
            if (existingDriver.isPresent()) {
                Driver driver = modelMapper.map(driverDTO, Driver.class);
                driver.setDriverId(id);

                // Handle profile picture update
                if (profilePicture != null && !profilePicture.isEmpty()) {
                    String profilePicturePath = imageStorageUtil.saveImage(profilePicture, uploadPath);
                    driver.setProfilePicturePath(profilePicturePath);
                }

                Driver updatedDriver = driverRepository.save(driver);
                return modelMapper.map(updatedDriver, DriverDTO.class);
            } else {
                throw new IllegalArgumentException("Driver not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating driver: " + e.getMessage());
            throw new RuntimeException("Error updating driver", e);
        }
    }

    public void deleteDriver(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Driver ID cannot be null");
            }
            driverRepository.deleteById(id);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error deleting driver: " + e.getMessage());
            // Consider whether to re-throw the exception or handle it.
        }
    }

    public List<DriverDTO> getAllDrivers() {
        try {
            List<Driver> drivers = driverRepository.findAll();
            return drivers.stream()
                    .map(driver -> modelMapper.map(driver, DriverDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting all drivers: " + e.getMessage());
            return List.of();
        }
    }

    public List<DriverDTO> getDriversByStatus(String status) {
        try {
            if (status == null || status.isEmpty()) {
                throw new IllegalArgumentException("Status cannot be null or empty");
            }
            List<Driver> drivers = driverRepository.findByStatus(status);
            return drivers.stream()
                    .map(driver -> modelMapper.map(driver, DriverDTO.class))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return List.of();
        } catch (Exception e) {
            System.err.println("Error getting drivers by status: " + e.getMessage());
            return List.of();
        }
    }


    public boolean hasDriverProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> userOptional = userRepository.findByUsername(currentUsername);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return user.getDriverId() != null;
        }
        return false;
    }
}