package com.example.mega.customer.service;

import com.example.mega.auth.model.User;
import com.example.mega.auth.repository.UserRepository;
import com.example.mega.customer.model.Customer;
import com.example.mega.customer.repository.CustomerRepository;
import com.example.mega.dto.CustomerDTO;
import com.example.mega.util.ImageStorageUtil;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final ImageStorageUtil imageStorageUtil;

    @Value("${upload.directory}") 
    private String uploadPath;

    @Autowired
    public CustomerService(CustomerRepository customerRepository, UserRepository userRepository, ModelMapper modelMapper, ImageStorageUtil imageStorageUtil) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
        this.imageStorageUtil = imageStorageUtil;
    }

    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO, MultipartFile profilePicture) {
        if (customerDTO == null) {
            throw new IllegalArgumentException("Customer object cannot be null");
        }

        if (customerRepository.findByNic(customerDTO.getNic()).isPresent()) {
            throw new IllegalArgumentException("NIC already exists");
        }

        //UserId is set at controller. No need to handle here again.

        Customer customer = modelMapper.map(customerDTO, Customer.class);

        // Handle profile picture upload (using corrected method)
        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                String profilePicturePath = imageStorageUtil.saveImage(profilePicture, uploadPath);
                customer.setProfilePicturePath(profilePicturePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save profile picture", e); // Handle IOException
            }
        }

        Customer savedCustomer = customerRepository.save(customer);

        // Update User entity (set customerId)
        User user = userRepository.findById(customerDTO.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + customerDTO.getUserId()));
        user.setCustomerId(savedCustomer.getCustomerId());
        userRepository.save(user);

        // Map back to DTO and return
        CustomerDTO savedDto = modelMapper.map(savedCustomer, CustomerDTO.class);
        return savedDto;
    }

    public Optional<CustomerDTO> getCustomerById(Integer id) {
        if (id == null) { //Though it is redundant it is better to keep.
            throw new IllegalArgumentException("Customer ID cannot be null");
        }
        return customerRepository.findById(id).map(customer -> modelMapper.map(customer, CustomerDTO.class));
    }

    public Optional<CustomerDTO> getCustomerByNic(String nic) {
        if (nic == null || nic.isEmpty()) { //Though it is redundant it is better to keep.
            throw new IllegalArgumentException("NIC cannot be null or empty");
        }
        return customerRepository.findByNic(nic).map(customer -> modelMapper.map(customer, CustomerDTO.class));
    }
    @Transactional
    public CustomerDTO updateCustomer(Integer id, CustomerDTO customerDTO, MultipartFile profilePicture) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));


        // Update fields (using ModelMapper for most, but manually for userId)
        modelMapper.map(customerDTO, customer);  //Model mapper won't map userId since source does not have it.
        customer.setCustomerId(id); // Ensure ID is set correctly

        // Handle profile picture update
        if (profilePicture != null && !profilePicture.isEmpty()) {
            // Delete old file (if it exists)
            if (customer.getProfilePicturePath() != null && !customer.getProfilePicturePath().isEmpty()) {
                imageStorageUtil.deleteImage(customer.getProfilePicturePath()); // Use ImageStorageUtil
            }

            try {
                String profilePicturePath = imageStorageUtil.saveImage(profilePicture, uploadPath); // Use ImageStorageUtil
                customer.setProfilePicturePath(profilePicturePath);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save updated profile picture", e);
            }
        }

        Customer updatedCustomer = customerRepository.save(customer);
        return modelMapper.map(updatedCustomer, CustomerDTO.class);
    }

    @Transactional
    public void deleteCustomer(Integer id) {
       Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));

        // Delete associated profile picture (if it exists)
        if (customer.getProfilePicturePath() != null && !customer.getProfilePicturePath().isEmpty()) {
            imageStorageUtil.deleteImage(customer.getProfilePicturePath()); // Use ImageStorageUtil
        }

        customerRepository.delete(customer); // Use delete, not deleteById (to handle entity properly)
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customer -> modelMapper.map(customer, CustomerDTO.class))
                .collect(Collectors.toList());
    }

    public boolean hasCustomerProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        Optional<User> userOptional = userRepository.findByUsername(currentUsername);
        return userOptional.map(user -> user.getCustomerId() != null).orElse(false);
    }

 
}