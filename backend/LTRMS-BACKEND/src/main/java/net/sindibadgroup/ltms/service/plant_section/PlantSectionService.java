package net.sindibadgroup.ltms.service.plant_section;

import net.sindibadgroup.ltms.dto.plant_section.PlantSectionDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PlantSectionService {
    List<PlantSectionDTO> getAll();
    List<PlantSectionDTO> getAllActive();
    PlantSectionDTO get(Integer id);
    PlantSectionDTO create(PlantSectionDTO dto);
    PlantSectionDTO modify(Integer id, PlantSectionDTO dto);
    PlantSectionDTO activate(Integer id);
    PlantSectionDTO deactivate(Integer id);
    void delete(Integer id);
    ResponseEntity<byte[]> exportPlantSectionsToExcel();
}