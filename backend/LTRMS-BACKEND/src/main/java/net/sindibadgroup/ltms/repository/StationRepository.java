package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.station.Station;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StationRepository extends JpaRepository<Station, Integer> {
    @Query("SELECT s.id FROM Station s WHERE s.circuit.id = :circuitId")
    List<Integer> findStationIdsByCircuitId(@Param("circuitId") Integer circuitId);

    List<Station> findByCircuit(Circuit circuit);
    Optional<Station> findByName(String name);
    List<Station> findByIsActiveTrue(); // Updated to match getter
}