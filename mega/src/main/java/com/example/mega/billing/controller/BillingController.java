package com.example.mega.billing.controller;

import com.example.mega.billing.service.BillingService;
import com.example.mega.dto.BillDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @PostMapping("/bills")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> createBill(@Valid @RequestBody BillDTO billDTO) {
        try {
            BillDTO createdBill = billingService.createBill(billDTO);
            return new ResponseEntity<>(createdBill, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating bill", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bills/{id}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER','ROLE_DRIVER')")
    public ResponseEntity<?> getBillById(@PathVariable Integer id) {
        try {
            return billingService.getBillById(id)
                    .map(bill -> ResponseEntity.ok(bill))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting bill by ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bills/booking/{bookingId}")
    @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_CUSTOMER','ROLE_DRIVER')")
    public ResponseEntity<?> getBillByBookingId(@PathVariable Integer bookingId) {
        try {
            return billingService.getBillByBookingId(bookingId)
                    .map(bill -> ResponseEntity.ok(bill))
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting bill by booking ID", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/bills/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> updateBill(@PathVariable Integer id, @Valid @RequestBody BillDTO billDTO) {
        try {
            BillDTO updatedBill = billingService.updateBill(id, billDTO);
            return ResponseEntity.ok(updatedBill);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating bill", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/bills/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> deleteBill(@PathVariable Integer id) {
        try {
            billingService.deleteBill(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error deleting bill", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/bills")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllBills() {
        try {
            List<BillDTO> bills = billingService.getAllBills();
            return ResponseEntity.ok(bills);
        } catch (Exception e) {
            return new ResponseEntity<>("Error getting all bills", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/bills/pay/{id}")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<?> payBill(@PathVariable Integer id) {
        try {
            BillDTO updatedBill = billingService.payBill(id);
            return ResponseEntity.ok(updatedBill);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("Error paying bill", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}