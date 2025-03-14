package com.example.mega.customer.controller;

import com.example.mega.auth.model.User;
import com.example.mega.auth.service.AuthService;
import com.example.mega.customer.service.CustomerService;
import com.example.mega.dto.CustomerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService; // Use final for constructor injection
    private final AuthService authService;

    @Autowired
    public CustomerController(CustomerService customerService, AuthService authService) {
        this.customerService = customerService;
        this.authService = authService;
    }


    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or (!hasRole('ROLE_DRIVER') and !@customerService.hasCustomerProfile())")
    public ResponseEntity<?> createCustomer(@Valid @ModelAttribute CustomerDTO customerDTO,
                                            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            User user = authService.getUserByUsername(currentUsername)
                    .orElseThrow(() -> new IllegalArgumentException("User does not exist")); //More concise and handles the optional.

            if (customerDTO == null) {
                return new ResponseEntity<>("Customer data cannot be null", HttpStatus.BAD_REQUEST);
            }

            customerDTO.setUserId(user.getId());
            CustomerDTO createdCustomer = customerService.createCustomer(customerDTO, profilePicture); // Pass profilePicture to service
            return new ResponseEntity<>(createdCustomer, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR); // More informative error message
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER','ROLE_DRIVER')")
    public ResponseEntity<?> getCustomerById(@PathVariable Integer id) {
        // No need to check for null id, Spring handles this with path variable.
        try {
            return customerService.getCustomerById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build()); // Cleaner Optional handling
        } catch (Exception e) { // Catch general exception last
             return new ResponseEntity<>("Error getting customer by ID: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



    @GetMapping("/nic/{nic}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER','ROLE_DRIVER')")
    public ResponseEntity<?> getCustomerByNic(@PathVariable String nic) {
         try {
            return customerService.getCustomerByNic(nic)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());  // Cleaner Optional handling
        }  catch (Exception e) {
            return new ResponseEntity<>("Error getting customer by NIC: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')") //principal.customer_id might not exist.
    public ResponseEntity<?> updateCustomer(@PathVariable Integer id, @Valid @ModelAttribute CustomerDTO customerDTO,
                                            @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {

            CustomerDTO updatedCustomer = customerService.updateCustomer(id, customerDTO, profilePicture); //Pass profilePicture to the service layer
            return ResponseEntity.ok(updatedCustomer);

        }  catch (IllegalArgumentException e) { // Catch specific exception first.
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) { // Catch general exception last.
            return new ResponseEntity<>("Error updating customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteCustomer(@PathVariable Integer id) {
        try {
            customerService.deleteCustomer(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting customer: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllCustomers() {
        try {
            List<CustomerDTO> customers = customerService.getAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting all customers: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}