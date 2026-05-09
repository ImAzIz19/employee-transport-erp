package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.vehicle.Vehicule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehiculeRepository extends JpaRepository<Vehicule, Long> {
    List<Vehicule> findByIsActiveTrue();
}