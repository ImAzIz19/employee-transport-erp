package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.segment.Segment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SegmentRepository extends JpaRepository<Segment, Integer> {
    Optional<Segment> findByName(String name);
    List<Segment> findByPlantSection(PlantSection plantSection);
    List<Segment> findByIsActiveTrue();
}