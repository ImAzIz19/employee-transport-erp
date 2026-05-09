package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.planification.BusPlan;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BusPlanRepository extends JpaRepository<BusPlan, Integer> {
    @Transactional
    @Modifying
    @Query("DELETE FROM BusPlan bp WHERE bp.week = :week AND bp.plantSection = :plantSection")
    void deleteByWeekAndPlantSection(@Param("week") String week, @Param("plantSection") PlantSection plantSection);

    @Query("SELECT b FROM BusPlan b WHERE b.week = :week")
    List<BusPlan> findByWeek(@Param("week") String week);

    @Query("SELECT b FROM BusPlan b WHERE b.week = :week AND b.agency = :agency")
    List<BusPlan> findByWeekAndAgency(@Param("week") String week, @Param("agency") Agency agency);

    @Query("SELECT b FROM BusPlan b JOIN FETCH b.circuit c JOIN FETCH c.stations WHERE b.week = :week " +
            "AND (:weekdays IS NULL OR b.weekday IN :weekdays) " +
            "AND (:shiftIds IS NULL OR b.shift IS NULL OR b.shift.id IN :shiftIds) " +
            "AND (:circuitIds IS NULL OR b.circuit IS NULL OR b.circuit.id IN :circuitIds)")
    List<BusPlan> findByWeekWithFilters(
            @Param("week") String week,
            @Param("weekdays") List<String> weekdays,
            @Param("shiftIds") List<Integer> shiftIds,
            @Param("circuitIds") List<Integer> circuitIds
    );

    @Query("SELECT b FROM BusPlan b JOIN FETCH b.circuit c JOIN FETCH c.stations WHERE b.week = :week AND b.agency = :agency " +
            "AND (:weekdays IS NULL OR b.weekday IN :weekdays) " +
            "AND (:shiftIds IS NULL OR b.shift IS NULL OR b.shift.id IN :shiftIds) " +
            "AND (:circuitIds IS NULL OR b.circuit IS NULL OR b.circuit.id IN :circuitIds)")
    List<BusPlan> findByWeekAndAgencyWithFilters(
            @Param("week") String week,
            @Param("agency") Agency agency,
            @Param("weekdays") List<String> weekdays,
            @Param("shiftIds") List<Integer> shiftIds,
            @Param("circuitIds") List<Integer> circuitIds
    );
}