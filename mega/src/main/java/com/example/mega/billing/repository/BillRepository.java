package com.example.mega.billing.repository;

import com.example.mega.billing.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {

    Optional<Bill> findByBookingId(Integer bookingId);

    // Add custom query methods to retrieve bills based on payment status or other criteria
    List<Bill> findByPaymentStatus(String paymentStatus);

    // Add custom query methods to retrieve bills within a date range
    // List<Bill> findByBillDateBetween(LocalDateTime startDate, LocalDateTime endDate);
}