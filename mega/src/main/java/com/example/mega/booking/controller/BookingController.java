package com.example.mega.booking.controller;

import com.example.mega.booking.service.BookingService;
import com.example.mega.dto.BookingDTO;
import com.example.mega.dto.CreateBookingDTO;
import com.example.mega.auth.service.AuthService;
import com.example.mega.auth.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody CreateBookingDTO createBookingDTO) {
        try {
            // Get authenticated user's information
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Optional<User> userOptional = authService.getUserByUsername(username);
            
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found for username: " + username, HttpStatus.NOT_FOUND);
            }

            User user = userOptional.get();
            Integer customerId = user.getCustomerId();


            BookingDTO createdBooking = bookingService.createBooking(createBookingDTO, customerId);
            return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating booking: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_DRIVER')")
    public ResponseEntity<?> getBookingById(@PathVariable Integer id) {
        try {
            Optional<BookingDTO> booking = bookingService.getBookingById(id);
            return booking.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting booking by ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/number/{bookingNumber}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_DRIVER')")
    public ResponseEntity<?> getBookingByBookingNumber(@PathVariable String bookingNumber) {
        try {
            Optional<BookingDTO> booking = bookingService.getBookingByBookingNumber(bookingNumber);
            return booking.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting booking by booking number", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/customer/{customerId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> getBookingsByCustomerId(@PathVariable Integer customerId) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByCustomerId(customerId);
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(bookings);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting bookings by customer ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/driver/{driverId}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> getBookingsByDriverId(@PathVariable Integer driverId) {
        try {
            List<BookingDTO> bookings = bookingService.getBookingsByDriverId(driverId);
            if (bookings.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(bookings);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting bookings by driver ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateBooking(@PathVariable Integer id, @Valid @RequestBody BookingDTO bookingDTO) {
        try {
            BookingDTO updatedBooking = bookingService.updateBooking(id, bookingDTO);
            return ResponseEntity.ok(updatedBooking);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating booking", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('ROLE_DRIVER')")
    public ResponseEntity<?> acceptBooking(
        @PathVariable Integer id,
        @RequestParam BigDecimal discountAmount) {
        try {
            // Get authenticated driver's information
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication.getName();
            Optional<User> userOptional = authService.getUserByUsername(username);
            
            if (!userOptional.isPresent()) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            User user = userOptional.get();
            Integer driverId = user.getDriverId();

            if (driverId == null) {
                return new ResponseEntity<>("User is not a driver", HttpStatus.BAD_REQUEST);
            }

            BookingDTO acceptedBooking = bookingService.acceptBooking(id, driverId, discountAmount);
            return ResponseEntity.ok(acceptedBooking);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error accepting booking: " + e.getMessage(), 
                HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER', 'ROLE_DRIVER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Integer id) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String role = authentication.getAuthorities().stream().findFirst().get().getAuthority();
            
            Optional<BookingDTO> booking = bookingService.getBookingById(id);
            if(booking.isPresent()) {
                String cancellationStatus = bookingService.cancelBooking(id, role);
                return ResponseEntity.ok("Booking cancelled: " + cancellationStatus);
            } else {
                return new ResponseEntity<>("Booking not found", HttpStatus.NOT_FOUND);
            }
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error cancelling booking", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> changeBookingStatus(
            @PathVariable Integer id,
            @RequestParam String newStatus) {
        try {
            BookingDTO updatedBooking = bookingService.changeBookingStatus(id, newStatus);
            return ResponseEntity.ok(updatedBooking);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating booking status", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting booking", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllBookings() {
        try {
            List<BookingDTO> bookings = bookingService.getAllBookings();
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting all bookings", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}