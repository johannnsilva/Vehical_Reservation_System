package com.example.mega.customer.repository;

import com.example.mega.customer.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {

  //  Optional<Customer> findByRegistrationNumber(String registrationNumber);
    Optional<Customer> findByNic(String nic);
}
