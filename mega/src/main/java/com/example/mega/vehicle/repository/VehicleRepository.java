package com.example.mega.vehicle.repository;

import com.example.mega.vehicle.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {

    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByStatus(String status);
    List<Vehicle> findByCurrentDriverId(Integer currentDriverId);
}