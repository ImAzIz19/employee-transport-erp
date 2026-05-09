package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.planification.Planification;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlanificationRepository extends JpaRepository<Planification, Long> {
    Optional<Planification> findByWeekAndPlantSection(String week, PlantSection plantSection);
}