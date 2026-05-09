package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.employee.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    @Query("SELECT e FROM Employee e WHERE e.isActiveForPlanification = true")
    List<Employee> findByIsActiveForPlanificationTrue();
    Optional<Employee> findBySerialNumber(Long serialNumber);
    @Query("SELECT e FROM Employee e " +
            "WHERE (:serialNumber IS NULL OR e.serialNumber = :serialNumber) " +
            "AND (:plantSectionId IS NULL OR e.plantSection.id = :plantSectionId)")
    List<Employee> findByCriteria(
            @Param("serialNumber") Long serialNumber,
            @Param("plantSectionId") Long plantSectionId
    );
    List<Employee> findAll();
    List<Employee> findByStationCircuitAgencyId(Long agencyId);
    List<Employee> findByStationCircuitId(Integer circuitId);
    List<Employee> findByIsActiveTrue();
}