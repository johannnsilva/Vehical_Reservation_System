package com.example.mega.auth.service;

import com.example.mega.auth.model.User;
import com.example.mega.auth.repository.UserRepository;
import com.example.mega.dto.UserDTO;
import com.example.mega.dto.UpdatePasswordDTO;
import com.example.mega.util.JwtUtil;
import com.example.mega.util.PasswordHashingUtil;
import lombok.Data;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;

import java.util.Optional;
import java.util.List;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordHashingUtil passwordHashingUtil;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ModelMapper modelMapper;


    public LoginResponse registerUser(UserDTO userDTO) {
          try {
            if (userRepository.findByUsername(userDTO.getUsername()).isPresent()) {
                throw new IllegalArgumentException("Username already exists");
            }

            User user = modelMapper.map(userDTO, User.class);

            if (user.getRole() != null && user.getRole().equalsIgnoreCase("ADMIN")) {
                throw new IllegalArgumentException("Cannot register a user with ADMIN role");
            }

            user.setPassword(passwordHashingUtil.hashPassword(user.getPassword()));
           User registeredUser = userRepository.save(user);
           String accessToken = jwtUtil.generateToken(registeredUser.getUsername(), registeredUser.getRole());
           String refreshToken = jwtUtil.generateRefreshToken(registeredUser.getUsername());

            return new LoginResponse(accessToken, refreshToken);
        } catch (Exception e) {
            System.err.println("Error registering user: " + e.getMessage());
            throw e;
        }
    }

    public LoginResponse login(String username, String password) {
        try {
            Optional<User> user = userRepository.findByUsername(username);
            if (user.isPresent() && passwordHashingUtil.verifyPassword(password, user.get().getPassword())) {
                 User foundUser = user.get();
                String accessToken = jwtUtil.generateToken(username, foundUser.getRole());
                String refreshToken = jwtUtil.generateRefreshToken(username);

                LoginResponse loginResponse = new LoginResponse(accessToken, refreshToken);

                 loginResponse.setId(foundUser.getId());
                 loginResponse.setUsername(foundUser.getUsername());
                 loginResponse.setRole(foundUser.getRole());
                 loginResponse.setCustomerId(foundUser.getCustomerId());
                 loginResponse.setDriverId(foundUser.getDriverId());
                return loginResponse;
            } else {
                throw new IllegalArgumentException("Invalid credentials");
            }
        } catch (Exception e) {
            System.err.println("Error logging in: " + e.getMessage());
            throw e;
        }
    }

    public String refreshToken(String refreshToken) {
        try {
            String username = jwtUtil.getUsernameFromToken(refreshToken);
            User user = userRepository.findByUsername(username).orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));
            if (jwtUtil.validateRefreshToken(refreshToken)) {
                return jwtUtil.generateToken(username, user.getRole());
            } else {
                throw new IllegalArgumentException("Invalid refresh token");
            }
        } catch (Exception e) {
            System.err.println("Error refreshing token: " + e.getMessage());
            throw e;
        }
    }


    public Optional<User> getUserById(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("User id cannot be null");
            }
            return userRepository.findById(id);
        } catch (Exception e) {
            System.err.println("Error getting user by ID: " + e.getMessage());
            return Optional.empty();
        }
    }
     public Optional<User> getUserByUsername(String username) {
        try {
            if (username == null) {
                throw new IllegalArgumentException("User username cannot be null");
            }
            return userRepository.findByUsername(username);
        } catch (Exception e) {
            System.err.println("Error getting user by username: " + e.getMessage());
            return Optional.empty();
        }
    }

     public void updatePassword(String username, UpdatePasswordDTO updatePasswordDTO) {
        try {
            if (username == null) {
                throw new IllegalArgumentException("Username cannot be null");
            }
            if (updatePasswordDTO == null) {
                throw new IllegalArgumentException("Update password DTO cannot be null");
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            if (!passwordHashingUtil.verifyPassword(updatePasswordDTO.getOldPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Invalid old password");
            }

            String hashedPassword = passwordHashingUtil.hashPassword(updatePasswordDTO.getNewPassword());
            user.setPassword(hashedPassword);
            userRepository.save(user);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating password: " + e.getMessage());
            throw new RuntimeException("Error updating password", e);
        }
    }

    public List<User> fetchUsers() {
        try {
            List<User> users = userRepository.findAll();
            // Clear sensitive information
            users.forEach(user -> user.setPassword("0"));
            return users;
        } catch (Exception e) {
            System.err.println("Error fetching users: " + e.getMessage());
            throw new RuntimeException("Error fetching users", e);
        }
    }

    public void updateUserStatus(Integer userId, String status) {
        try {
            if (userId == null) {
                throw new IllegalArgumentException("User ID cannot be null");
            }
            if (status == null || status.trim().isEmpty()) {
                throw new IllegalArgumentException("Status cannot be null or empty");
            }
            
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
            // Validate status value - changed to check for 'active' or 'blocked'
            if (!status.equalsIgnoreCase("active") && !status.equalsIgnoreCase("blocked")) {
                throw new IllegalArgumentException("Invalid status value. Must be 'active' or 'blocked'");
            }
            
            user.setStatus(status.toLowerCase());
            userRepository.save(user);
        } catch (Exception e) {
            System.err.println("Error updating user status: " + e.getMessage());
            throw e;
        }
    }

    @Data
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
         private Integer id;
        private String username;
        private String role;
        private Integer customerId;
        private Integer driverId;

        public LoginResponse(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }
}