package com.example.mega.booking.service;

import com.example.mega.booking.model.Booking;
import com.example.mega.booking.repository.BookingRepository;
import com.example.mega.dto.BookingDTO;
import com.example.mega.dto.BillDTO;
import com.example.mega.dto.CreateBookingDTO;
import com.example.mega.billing.service.BillingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private BillingService billingService;

    public BookingDTO createBooking(CreateBookingDTO createBookingDTO, Integer customerId) {
        try {
            if (createBookingDTO == null) {
                throw new IllegalArgumentException("Booking object cannot be null");
            }

            // Generate unique booking number
            String bookingNumber = generateBookingNumber();

            // Map CreateBookingDTO to BookingDTO with additional fields
            BookingDTO bookingDTO = new BookingDTO();
            bookingDTO.setBookingNumber(bookingNumber);
            bookingDTO.setPickupAddress(createBookingDTO.getPickupAddress());
            bookingDTO.setDestinationAddress(createBookingDTO.getDestinationAddress());
            bookingDTO.setDistance(createBookingDTO.getDistance());
            
            // Calculate amount based on distance
            BigDecimal ratePerKm = new BigDecimal("100");
            BigDecimal amount = createBookingDTO.getDistance().multiply(ratePerKm);
            bookingDTO.setAmount(amount);
            
            bookingDTO.setDriverId(createBookingDTO.getDriverId());
            bookingDTO.setPickupTime(LocalDateTime.parse(createBookingDTO.getPickupTime()));
            bookingDTO.setVehicleId(createBookingDTO.getVehicleId());
            bookingDTO.setCustomerId(customerId);
            bookingDTO.setStatus("PENDING");
            bookingDTO.setBookingDate(LocalDateTime.now());

            Booking booking = modelMapper.map(bookingDTO, Booking.class);
            Booking savedBooking = bookingRepository.save(booking);
            return modelMapper.map(savedBooking, BookingDTO.class);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error creating booking: " + e.getMessage());
            throw new RuntimeException("Error creating booking", e);
        }
    }

    private String generateBookingNumber() {
        // Generate booking number: timestamp + random 4 digits
        long timestamp = System.currentTimeMillis();
        int random = (int) (Math.random() * 10000);
        return String.format("BK%d%04d", timestamp % 10000, random);
    }

    public Optional<BookingDTO> getBookingById(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Booking ID cannot be null");
            }
            Optional<Booking> booking = bookingRepository.findById(id);
            return booking.map(b -> modelMapper.map(b, BookingDTO.class));
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting booking by ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<BookingDTO> getBookingByBookingNumber(String bookingNumber) {
        try {
            if (bookingNumber == null || bookingNumber.isEmpty()) {
                throw new IllegalArgumentException("Booking number cannot be null or empty");
            }
            Optional<Booking> booking = bookingRepository.findByBookingNumber(bookingNumber);
            return booking.map(b -> modelMapper.map(b, BookingDTO.class));
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting booking by booking number: " + e.getMessage());
            return Optional.empty();
        }
    }

    public List<BookingDTO> getBookingsByCustomerId(Integer customerId) {
        try {
            if (customerId == null) {
                throw new IllegalArgumentException("Customer ID cannot be null");
            }
            List<Booking> bookings = bookingRepository.findByCustomerId(customerId);
            return bookings.stream()
                    .map(booking -> modelMapper.map(booking, BookingDTO.class))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return List.of();
        } catch (Exception e) {
            System.err.println("Error getting bookings by customer ID: " + e.getMessage());
            return List.of();
        }
    }
    public Optional<BookingDTO> getBookingById(String username) {
        return Optional.empty();
    }

    public List<BookingDTO> getBookingsByDriverId(Integer driverId) {
        try {
            if (driverId == null) {
                throw new IllegalArgumentException("Driver ID cannot be null");
            }
            List<Booking> bookings = bookingRepository.findByDriverId(driverId);
            return bookings.stream()
                    .map(booking -> modelMapper.map(booking, BookingDTO.class))
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return List.of();
        } catch (Exception e) {
            System.err.println("Error getting bookings by driver ID: " + e.getMessage());
            return List.of();
        }
    }

    public BookingDTO updateBooking(Integer id, BookingDTO bookingDTO) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Booking ID cannot be null");
            }
            if (bookingDTO == null) {
                throw new IllegalArgumentException("Booking object cannot be null");
            }
            Optional<Booking> existingBooking = bookingRepository.findById(id);
            if (existingBooking.isPresent()) {
                // Calculate amount based on distance
                BigDecimal ratePerKm = new BigDecimal("100");
                BigDecimal amount = bookingDTO.getDistance().multiply(ratePerKm);
                bookingDTO.setAmount(amount);
                
                Booking booking = modelMapper.map(bookingDTO, Booking.class);
                booking.setBookingId(id);
                Booking updatedBooking = bookingRepository.save(booking);
                return modelMapper.map(updatedBooking, BookingDTO.class);
            } else {
                throw new IllegalArgumentException("Booking not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating booking: " + e.getMessage());
            throw new RuntimeException("Error updating booking", e);
        }
    }

    public String cancelBooking(Integer bookingId, String role) {
        try {
            if (bookingId == null) {
                throw new IllegalArgumentException("Booking ID cannot be null");
            }

            Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
            if (bookingOptional.isEmpty()) {
                throw new IllegalArgumentException("Booking not found with ID: " + bookingId);
            }

            Booking booking = bookingOptional.get();

            if (role == null || role.trim().isEmpty()) {
                throw new IllegalArgumentException("Role cannot be null or empty");
            }

            // Normalize the role string and remove "ROLE_" prefix if present
            String normalizedRole = role.toUpperCase().replace("ROLE_", "");
            String cancellationStatus;

            switch (normalizedRole) {
                case "DRIVER":
                    booking.setStatus("DRIVER_CANCELLED");
                    booking.setDriverId(null);
                    cancellationStatus = "DRIVER_CANCELLED";
                    break;
                case "CUSTOMER":
                    booking.setStatus("CUSTOMER_CANCELLED");
                    cancellationStatus = "CUSTOMER_CANCELLED";
                    break;
                case "ADMIN":
                    booking.setStatus("ADMIN_CANCELLED");
                    cancellationStatus = "ADMIN_CANCELLED";
                    break;
                default:
                    throw new IllegalArgumentException("Invalid role for cancelling booking: " + role);
            }

            bookingRepository.save(booking);
            return cancellationStatus;

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error cancelling booking: " + e.getMessage());
            throw new RuntimeException("Error cancelling booking", e);
        }
    }

    public void deleteBooking(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Booking ID cannot be null");
            }
            bookingRepository.deleteById(id);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error deleting booking: " + e.getMessage());
            // Consider whether to re-throw the exception or handle it.
        }
    }

    public List<BookingDTO> getAllBookings() {
        try {
            List<Booking> bookings = bookingRepository.findAll();
            return bookings.stream()
                    .map(booking -> modelMapper.map(booking, BookingDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting all bookings: " + e.getMessage());
            return List.of();
        }
    }

    public BookingDTO acceptBooking(Integer bookingId, Integer driverId, BigDecimal discountPercentage) {
        try {
            if (bookingId == null || driverId == null) {
                throw new IllegalArgumentException("Booking ID and Driver ID cannot be null");
            }

            Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
            if (bookingOptional.isEmpty()) {
                throw new IllegalArgumentException("Booking not found with ID: " + bookingId);
            }

            Booking booking = bookingOptional.get();
            
            // Check if booking is already accepted
            if (!"PENDING".equals(booking.getStatus())) {
                throw new IllegalArgumentException("Booking cannot be accepted - current status: " + booking.getStatus());
            }

            // Update booking status and driver
            booking.setStatus("ACCEPTED");
            booking.setDriverId(driverId);
            Booking savedBooking = bookingRepository.save(booking);

            // Validate discount percentage
            if (discountPercentage.compareTo(BigDecimal.ZERO) < 0 || 
                discountPercentage.compareTo(new BigDecimal("100")) > 0) {
                throw new IllegalArgumentException("Discount percentage must be between 0 and 100");
            }

            // Calculate actual discount amount based on percentage
            BigDecimal discountAmount = booking.getAmount()
                .multiply(discountPercentage)
                .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

            // Create bill
            BillDTO billDTO = new BillDTO();
            billDTO.setBookingId(bookingId);
            billDTO.setTotalAmount(booking.getAmount());
            
            // Calculate tax amount (2% of total amount)
            BigDecimal taxRate = new BigDecimal("0.02");
            BigDecimal taxAmount = booking.getAmount().multiply(taxRate)
                .setScale(2, RoundingMode.HALF_UP);
            billDTO.setTaxAmount(taxAmount);
            
            // Set calculated discount amount
            billDTO.setDiscountAmount(discountAmount);
            
            // Set payment status and method
            billDTO.setPaymentStatus("PENDING");
            billDTO.setPaymentMethod("NOT_SPECIFIED");
            
            // Set bill date
            billDTO.setBillDate(LocalDateTime.now());

            // Create bill using billing service
            billingService.createBill(billDTO);

            return modelMapper.map(savedBooking, BookingDTO.class);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error accepting booking: " + e.getMessage());
            throw new RuntimeException("Error accepting booking", e);
        }
    }

    public BookingDTO changeBookingStatus(Integer bookingId, String newStatus) {
        try {
            if (bookingId == null) {
                throw new IllegalArgumentException("Booking ID cannot be null");
            }

            Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
            if (bookingOptional.isEmpty()) {
                throw new IllegalArgumentException("Booking not found with ID: " + bookingId);
            }

            Booking booking = bookingOptional.get();
            booking.setStatus(newStatus);
            Booking savedBooking = bookingRepository.save(booking);
            return modelMapper.map(savedBooking, BookingDTO.class);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating booking status: " + e.getMessage());
            throw new RuntimeException("Error updating booking status", e);
        }
    }
}