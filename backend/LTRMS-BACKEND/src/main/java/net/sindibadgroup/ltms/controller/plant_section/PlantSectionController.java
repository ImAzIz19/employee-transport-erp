package net.sindibadgroup.ltms.controller.plant_section;

import net.sindibadgroup.ltms.dto.plant_section.PlantSectionDTO;
import net.sindibadgroup.ltms.service.plant_section.PlantSectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plant-sections")
public class PlantSectionController {

    @Autowired
    private PlantSectionService plantSectionService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('plant_section:read')")
    public ResponseEntity<List<PlantSectionDTO>> getAll() {
        List<PlantSectionDTO> plantSections = plantSectionService.getAll();
        return ResponseEntity.ok(plantSections);
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('plant_section:read')")
    public ResponseEntity<List<PlantSectionDTO>> getAllActive() {
        List<PlantSectionDTO> plantSections = plantSectionService.getAllActive();
        return ResponseEntity.ok(plantSections);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('plant_section:read')")
    public ResponseEntity<PlantSectionDTO> get(@PathVariable Integer id) {
        PlantSectionDTO plantSection = plantSectionService.get(id);
        return ResponseEntity.ok(plantSection);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('plant_section:create')")
    public ResponseEntity<PlantSectionDTO> create(@RequestBody PlantSectionDTO dto) {
        PlantSectionDTO createdPlantSection = plantSectionService.create(dto);
        return ResponseEntity.ok(createdPlantSection);
    }

    @PutMapping("/modify/{id}")
    @PreAuthorize("hasAuthority('plant_section:update')")
    public ResponseEntity<PlantSectionDTO> modify(
            @PathVariable Integer id,
            @RequestBody PlantSectionDTO dto) {
        PlantSectionDTO updatedPlantSection = plantSectionService.modify(id, dto);
        return ResponseEntity.ok(updatedPlantSection);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('plant_section:status')")
    public ResponseEntity<PlantSectionDTO> activate(@PathVariable Integer id) {
        PlantSectionDTO activatedPlantSection = plantSectionService.activate(id);
        return ResponseEntity.ok(activatedPlantSection);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('plant_section:status')")
    public ResponseEntity<PlantSectionDTO> deactivate(@PathVariable Integer id) {
        PlantSectionDTO deactivatedPlantSection = plantSectionService.deactivate(id);
        return ResponseEntity.ok(deactivatedPlantSection);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('plant_section:delete')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        plantSectionService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('plantsection:export')")
    public ResponseEntity<byte[]> exportPlantSectionsToExcel() {
        return plantSectionService.exportPlantSectionsToExcel();
    }
}