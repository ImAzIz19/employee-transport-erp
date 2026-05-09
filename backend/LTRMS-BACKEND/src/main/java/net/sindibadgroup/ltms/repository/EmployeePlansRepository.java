package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.employee.EmployeePlans;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmployeePlansRepository extends JpaRepository<EmployeePlans, Integer> {

    @Query("SELECT ep FROM EmployeePlans ep " +
            "JOIN ep.employee e " +
            "WHERE e.serialNumber = :matricule " +
            "AND (:week IS NULL OR ep.week = :week) " +
            "AND (:plantSectionId IS NULL OR e.plantSection.id = :plantSectionId)")
    List<EmployeePlans> findByCriteria(
            @Param("week") String week,
            @Param("plantSectionId") Long plantSectionId,
            @Param("matricule") Long matricule
    );
    @Modifying
    @Query("DELETE FROM EmployeePlans ep WHERE ep.week = :week AND ep.employee.plantSection = :plantSection")
    void deleteByWeekAndEmployeePlantSection(@Param("week") String week, @Param("plantSection") PlantSection plantSection);

    @Query("SELECT ep FROM EmployeePlans ep WHERE ep.week = :week AND ep.employee.plantSection = :plantSection")
    List<EmployeePlans> findByWeekAndEmployeePlantSection(@Param("week") String week, @Param("plantSection") PlantSection plantSection);
}
