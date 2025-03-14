package com.example.mega.driver.repository;

import com.example.mega.driver.model.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Integer> {

    Optional<Driver> findByLicenseNumber(String licenseNumber);
    List<Driver> findByStatus(String status);
}