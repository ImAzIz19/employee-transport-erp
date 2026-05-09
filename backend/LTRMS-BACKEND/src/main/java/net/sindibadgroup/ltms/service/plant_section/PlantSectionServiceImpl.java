package net.sindibadgroup.ltms.service.plant_section;

import net.sindibadgroup.ltms.dto.plant_section.PlantSectionDTO;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.segment.Segment;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.repository.PlantSectionRepository;
import net.sindibadgroup.ltms.repository.SegmentRepository;
import net.sindibadgroup.ltms.repository.UserRepository;
import net.sindibadgroup.ltms.service.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PlantSectionServiceImpl implements PlantSectionService {

    @Autowired
    private PlantSectionRepository plantSectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SegmentRepository segmentRepository;

    @Autowired
    private FileService fileService;

    @Override
    @Transactional(readOnly = true)
    public List<PlantSectionDTO> getAll() {
        return plantSectionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PlantSectionDTO> getAllActive() {
        return plantSectionRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PlantSectionDTO get(Integer id) {
        PlantSection plantSection = plantSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PlantSection not found with ID: " + id));
        return convertToDTO(plantSection);
    }

    @Override
    @Transactional
    public PlantSectionDTO create(PlantSectionDTO dto) {
        PlantSection plantSection = new PlantSection();
        mapDTOToPlantSection(dto, plantSection);
        PlantSection saved = plantSectionRepository.save(plantSection);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public PlantSectionDTO modify(Integer id, PlantSectionDTO dto) {
        PlantSection plantSection = plantSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PlantSection not found with ID: " + id));
        mapDTOToPlantSection(dto, plantSection);
        PlantSection updated = plantSectionRepository.save(plantSection);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public PlantSectionDTO activate(Integer id) {
        PlantSection plantSection = plantSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PlantSection not found with ID: " + id));
        plantSection.setActive(true);
        PlantSection updated = plantSectionRepository.save(plantSection);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public PlantSectionDTO deactivate(Integer id) {
        PlantSection plantSection = plantSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PlantSection not found with ID: " + id));
        plantSection.setActive(false);
        PlantSection updated = plantSectionRepository.save(plantSection);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        PlantSection plantSection = plantSectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PlantSection not found with ID: " + id));
        if (plantSection.isActive()) {
            throw new RuntimeException("Cannot delete active PlantSection. Deactivate first.");
        }
        plantSectionRepository.delete(plantSection);
    }

    private void mapDTOToPlantSection(PlantSectionDTO dto, PlantSection plantSection) {
        if (dto.getPsManagerId() != null) {
            UserEntity psManager = userRepository.findById(dto.getPsManagerId())
                    .orElseThrow(() -> new RuntimeException("PS Manager not found with ID: " + dto.getPsManagerId()));
            if (!hasRole(psManager, "PS_MANAGER")) {
                throw new RuntimeException("Assigned PS Manager must have PS_MANAGER role");
            }
            plantSection.setPsManager(psManager);
        } else {
            plantSection.setPsManager(null);
        }

        if (dto.getRhManagerId() != null) {
            UserEntity rhManager = userRepository.findById(dto.getRhManagerId())
                    .orElseThrow(() -> new RuntimeException("RH Manager not found with ID: " + dto.getRhManagerId()));
            if (!hasRole(rhManager, "RH_MANAGER")) {
                throw new RuntimeException("Assigned RH Manager must have RH_MANAGER role");
            }
            plantSection.setRhManager(rhManager);
        } else {
            plantSection.setRhManager(null);
        }

        plantSection.setName(dto.getPlantsection_name());
        plantSection.setDescription(dto.getDescription());
        plantSection.setEmplacement(dto.getEmplacement());
        plantSection.setOrganization(dto.getOrganization());

        Set<Integer> dtoSegmentIds = dto.getSegmentIds() != null ? dto.getSegmentIds() : Set.of();

        List<Segment> currentSegments = segmentRepository.findByPlantSection(plantSection);

        for (Segment segment : currentSegments) {
            if (!dtoSegmentIds.contains(segment.getId())) {
                segment.setPlantSection(null);
                segmentRepository.save(segment);
            }
        }

        if (!dtoSegmentIds.isEmpty()) {
            List<Segment> segmentsToUpdate = segmentRepository.findAllById(dtoSegmentIds);
            for (Segment segment : segmentsToUpdate) {
                if (segment != null) {
                    segment.setPlantSection(plantSection);
                    segmentRepository.save(segment);
                }
            }
        }
    }

    private PlantSectionDTO convertToDTO(PlantSection plantSection) {
        PlantSectionDTO dto = new PlantSectionDTO();
        dto.setId(plantSection.getId());
        dto.setPlantsection_name(plantSection.getName());
        dto.setDescription(plantSection.getDescription());
        dto.setEmplacement(plantSection.getEmplacement());
        dto.setPsManagerId(plantSection.getPsManager() != null ? plantSection.getPsManager().getId() : null);
        dto.setRhManagerId(plantSection.getRhManager() != null ? plantSection.getRhManager().getId() : null);
        dto.setOrganization(plantSection.getOrganization());
        dto.setActive(plantSection.isActive());

        Set<Integer> segmentIds = segmentRepository.findByPlantSection(plantSection)
                .stream()
                .map(Segment::getId)
                .collect(Collectors.toSet());
        dto.setSegmentIds(segmentIds);

        return dto;
    }

    private boolean hasRole(UserEntity user, String roleName) {
        return user.getRoles().stream()
                .anyMatch(role -> role.getName().equals(roleName));
    }

    @Override
    public ResponseEntity<byte[]> exportPlantSectionsToExcel() {
        List<PlantSectionDTO> plantSections = getAllActive();
        String[] headers = {"Name", "Description", "Emplacement", "PS Manager", "RH Manager", "Organization", "Segments"};
        Function<PlantSectionDTO, String[]> dataMapper = plantSection -> {
            String psManagerName = "N/A";
            String rhManagerName = "N/A";
            String segmentNames = "N/A";
            if (plantSection.getPsManagerId() != null) {
                UserEntity psManager = userRepository.findById(plantSection.getPsManagerId())
                        .orElse(null);
                psManagerName = psManager != null ? psManager.getFirstName() + " " + psManager.getLastName() : "N/A";
            }
            if (plantSection.getRhManagerId() != null) {
                UserEntity rhManager = userRepository.findById(plantSection.getRhManagerId())
                        .orElse(null);
                rhManagerName = rhManager != null ? rhManager.getFirstName() + " " + rhManager.getLastName() : "N/A";
            }
            if (plantSection.getSegmentIds() != null && !plantSection.getSegmentIds().isEmpty()) {
                List<Segment> segments = segmentRepository.findAllById(plantSection.getSegmentIds());
                segmentNames = segments.stream()
                        .map(Segment::getName)
                        .filter(name -> name != null)
                        .collect(Collectors.joining(", "));
                if (segmentNames.isEmpty()) {
                    segmentNames = "N/A";
                }
            }
            return new String[] {
                    plantSection.getPlantsection_name(),
                    plantSection.getDescription(),
                    plantSection.getEmplacement(),
                    psManagerName,
                    rhManagerName,
                    plantSection.getOrganization(),
                    segmentNames
            };
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(plantSections, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "plant_sections.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}