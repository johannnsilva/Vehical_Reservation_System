package com.example.mega.billing.service;

import com.example.mega.billing.model.Bill;
import com.example.mega.billing.repository.BillRepository;
import com.example.mega.dto.BillDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillingService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ModelMapper modelMapper;

    public BillDTO createBill(BillDTO billDTO) {
        try {
            if (billDTO == null) {
                throw new IllegalArgumentException("Bill object cannot be null");
            }
            if (billRepository.findByBookingId(billDTO.getBookingId()).isPresent()) {
                throw new IllegalArgumentException("Bill with this booking ID already exists");
            }

            Bill bill = modelMapper.map(billDTO, Bill.class);
            Bill savedBill = billRepository.save(bill);
            return modelMapper.map(savedBill, BillDTO.class);

        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error creating bill: " + e.getMessage());
            throw new RuntimeException("Error creating bill", e);
        }
    }

    public Optional<BillDTO> getBillById(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Bill ID cannot be null");
            }
            Optional<Bill> bill = billRepository.findById(id);
            return bill.map(b -> modelMapper.map(b, BillDTO.class));
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting bill by ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    public Optional<BillDTO> getBillByBookingId(Integer bookingId) {
        try {
            if (bookingId == null) {
                throw new IllegalArgumentException("Booking ID cannot be null");
            }
            Optional<Bill> bill = billRepository.findByBookingId(bookingId);
            return bill.map(b -> modelMapper.map(b, BillDTO.class));
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            return Optional.empty();
        } catch (Exception e) {
            System.err.println("Error getting bill by booking ID: " + e.getMessage());
            return Optional.empty();
        }
    }

    public BillDTO updateBill(Integer id, BillDTO billDTO) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Bill ID cannot be null");
            }
            if (billDTO == null) {
                throw new IllegalArgumentException("Bill object cannot be null");
            }
            Optional<Bill> existingBill = billRepository.findById(id);
            if (existingBill.isPresent()) {
                Bill bill = modelMapper.map(billDTO, Bill.class);
                bill.setBillId(id);
                Bill updatedBill = billRepository.save(bill);
                return modelMapper.map(updatedBill, BillDTO.class);
            } else {
                throw new IllegalArgumentException("Bill not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating bill: " + e.getMessage());
            throw new RuntimeException("Error updating bill", e);
        }
    }

    public void deleteBill(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Bill ID cannot be null");
            }
            billRepository.deleteById(id);
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("Error deleting bill: " + e.getMessage());
            // Consider whether to re-throw the exception or handle it.
        }
    }

    public List<BillDTO> getAllBills() {
        try {
            List<Bill> bills = billRepository.findAll();
            return bills.stream()
                    .map(bill -> modelMapper.map(bill, BillDTO.class))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Error getting all bills: " + e.getMessage());
            return List.of();
        }
    }

    public BillDTO payBill(Integer id) {
        try {
            if (id == null) {
                throw new IllegalArgumentException("Bill ID cannot be null");
            }
            Optional<Bill> optionalBill = billRepository.findById(id);
            if (optionalBill.isPresent()) {
                Bill bill = optionalBill.get();
                bill.setPaymentStatus("Payment Completed");
                Bill updatedBill = billRepository.save(bill);
                return modelMapper.map(updatedBill, BillDTO.class);
            } else {
                throw new IllegalArgumentException("Bill not found with ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Invalid input: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("Error updating bill: " + e.getMessage());
            throw new RuntimeException("Error updating bill", e);
        }
    }
}