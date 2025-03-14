package com.example.mega.booking.repository;

import com.example.mega.booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    Optional<Booking> findByBookingNumber(String bookingNumber);
    List<Booking> findByCustomerId(Integer customerId);
    List<Booking> findByDriverId(Integer driverId);
}