package com.example.mega.auth.controller;

import com.example.mega.auth.service.AuthService;
import com.example.mega.dto.UserDTO;
import com.example.mega.dto.UpdatePasswordDTO;
import com.example.mega.auth.model.User;
import com.example.mega.dto.RefreshTokenRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody UserDTO userDTO) {
        try {
            AuthService.LoginResponse registrationResponse = authService.registerUser(userDTO);
            return new ResponseEntity<>(registrationResponse, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error registering user", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
        try {
            AuthService.LoginResponse loginResponse = authService.login(username, password);
            return ResponseEntity.ok(loginResponse);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error logging in", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        try {
            String accessToken = authService.refreshToken(refreshTokenRequest.getRefreshToken());
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", accessToken);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error refreshing token", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/user/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_DRIVER')")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = authentication.getName();

            Optional<User> requestingUserOptional = authService.getUserById(id);

           if (requestingUserOptional.isPresent()) {
                String role =   authentication.getAuthorities().stream().findFirst().get().getAuthority();

                Optional<User> userOptional = authService.getUserById(id);

                if (userOptional.isPresent()) {
                    User user = userOptional.get();


                   // Prevent others from retrieving ADMIN user objects unless they are ADMIN role or same user
                    if (user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN")
                           && !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))
                           && !currentUsername.equals(user.getUsername())) {
                        return new ResponseEntity<>("Access denied: Cannot retrieve ADMIN user", HttpStatus.FORBIDDEN);
                    }
                  // change start
                   Optional<User> currentUserOptional = authService.getUserByUsername(currentUsername); // Fetch current user by username
                   if(!role.equals("ROLE_ADMIN") && !currentUsername.equals(user.getUsername()) && id!= currentUserOptional.get().getId()  ) {
                       return new ResponseEntity<>("Access denied", HttpStatus.FORBIDDEN);
                   }
                   // change end

                    user.setPassword("0"); // Clear the password
                    return ResponseEntity.ok(user);
                } else {
                    return ResponseEntity.notFound().build();
                }
            }else {
                return new ResponseEntity<>("Requesting user not found", HttpStatus.NOT_FOUND);
            }

        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting user by ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/update-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordDTO updatePasswordDTO) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            authService.updatePassword(username, updatePasswordDTO);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating password", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = authService.fetchUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return new ResponseEntity<>("Error fetching users", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/user/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateUserStatus(
            @PathVariable Integer id,
            @RequestParam String status) {
        try {
            authService.updateUserStatus(id, status);
            return ResponseEntity.ok("User status updated successfully");
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating user status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}