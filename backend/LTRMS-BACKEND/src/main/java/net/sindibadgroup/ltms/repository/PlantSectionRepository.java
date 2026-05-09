package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PlantSectionRepository extends JpaRepository<PlantSection, Integer> {
    Optional<PlantSection> findByName(String name);
    List<PlantSection> findByIsActiveTrue();
}