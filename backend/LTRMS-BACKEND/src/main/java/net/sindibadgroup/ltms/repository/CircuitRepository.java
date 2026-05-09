package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.circuit.Circuit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CircuitRepository extends JpaRepository<Circuit, Integer> {
    Optional<Circuit> findByLeoniSapReference(String leoniSapReference);
    List<Circuit> findByIsActiveTrue();
}