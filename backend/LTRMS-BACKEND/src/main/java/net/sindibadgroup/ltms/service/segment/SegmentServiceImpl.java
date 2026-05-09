package net.sindibadgroup.ltms.service.segment;

import net.sindibadgroup.ltms.dto.segment.SegmentDTO;
import net.sindibadgroup.ltms.model.segment.Segment;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.repository.SegmentRepository;
import net.sindibadgroup.ltms.repository.PlantSectionRepository;
import net.sindibadgroup.ltms.repository.UserRepository;
import net.sindibadgroup.ltms.service.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class SegmentServiceImpl implements SegmentService {

    @Autowired
    private SegmentRepository segmentRepository;

    @Autowired
    private PlantSectionRepository plantSectionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileService fileService;

    @Override
    public List<SegmentDTO> getAll() {
        return segmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SegmentDTO> getAllActive() {
        return segmentRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SegmentDTO get(Integer id) {
        return segmentRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Segment not found"));
    }

    @Override
    public SegmentDTO create(SegmentDTO dto) {
        Segment segment = new Segment();

        if (dto.getPlantSectionId() == null) {
            throw new RuntimeException("Plant Section ID is required");
        }
        PlantSection plantSection = plantSectionRepository.findById(dto.getPlantSectionId())
                .orElseThrow(() -> new RuntimeException("Plant Section not found"));
        segment.setPlantSection(plantSection);

        if (dto.getRhSegmentId() != null) {
            UserEntity rhSegment = userRepository.findById(dto.getRhSegmentId())
                    .orElseThrow(() -> new RuntimeException("RH Segment user not found"));
            if (!hasRole(rhSegment, "RH_SEGMENT")) {
                throw new RuntimeException("Assigned RH Segment must have RH_SEGMENT role");
            }
            segment.setRhSegment(rhSegment);
        }

        if (dto.getChefSegmentId() != null) {
            UserEntity chefSegment = userRepository.findById(dto.getChefSegmentId())
                    .orElseThrow(() -> new RuntimeException("Chef Segment user not found"));
            if (!hasRole(chefSegment, "CHEF_SEGMENT")) {
                throw new RuntimeException("Assigned Chef Segment must have CHEF_SEGMENT role");
            }
            segment.setChefSegment(chefSegment);
        }

        segment.setName(dto.getSegment_name());
        segment.setCostCenter(dto.getCostCenter());
        segment.setSapRef(dto.getSapRef());

        Segment saved = segmentRepository.save(segment);
        return convertToDTO(saved);
    }

    @Override
    public SegmentDTO modify(Integer id, SegmentDTO dto) {
        Segment segment = segmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Segment not found"));

        if (dto.getPlantSectionId() != null) {
            PlantSection plantSection = plantSectionRepository.findById(dto.getPlantSectionId())
                    .orElseThrow(() -> new RuntimeException("Plant Section not found"));
            segment.setPlantSection(plantSection);
        }

        if (dto.getRhSegmentId() != null) {
            UserEntity rhSegment = userRepository.findById(dto.getRhSegmentId())
                    .orElseThrow(() -> new RuntimeException("RH Segment user not found"));
            if (!hasRole(rhSegment, "RH_SEGMENT")) {
                throw new RuntimeException("Assigned RH Segment must have RH_SEGMENT role");
            }
            segment.setRhSegment(rhSegment);
        }

        if (dto.getChefSegmentId() != null) {
            UserEntity chefSegment = userRepository.findById(dto.getChefSegmentId())
                    .orElseThrow(() -> new RuntimeException("Chef Segment user not found"));
            if (!hasRole(chefSegment, "CHEF_SEGMENT")) {
                throw new RuntimeException("Assigned Chef Segment must have CHEF_SEGMENT role");
            }
            segment.setChefSegment(chefSegment);
        }

        segment.setName(dto.getSegment_name());
        segment.setCostCenter(dto.getCostCenter());
        segment.setSapRef(dto.getSapRef());

        Segment updated = segmentRepository.save(segment);
        return convertToDTO(updated);
    }

    @Override
    public SegmentDTO activate(Integer id) {
        Segment segment = segmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Segment not found"));
        segment.setActive(true);
        Segment updated = segmentRepository.save(segment);
        return convertToDTO(updated);
    }

    @Override
    public SegmentDTO deactivate(Integer id) {
        Segment segment = segmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Segment not found"));
        segment.setActive(false);
        Segment updated = segmentRepository.save(segment);
        return convertToDTO(updated);
    }

    @Override
    public void delete(Integer id) {
        Segment segment = segmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Segment not found"));

        if (segment.isActive()) {
            throw new RuntimeException("Cannot delete active Segment. Deactivate first.");
        }

        segmentRepository.delete(segment);
    }

    private SegmentDTO convertToDTO(Segment segment) {
        SegmentDTO dto = new SegmentDTO();
        dto.setId(segment.getId());
        dto.setSegment_name(segment.getName());
        dto.setCostCenter(segment.getCostCenter());
        dto.setSapRef(segment.getSapRef());
        dto.setPlantSectionId(segment.getPlantSection() != null ? segment.getPlantSection().getId() : null);
        dto.setRhSegmentId(segment.getRhSegment() != null ? segment.getRhSegment().getId() : null);
        dto.setChefSegmentId(segment.getChefSegment() != null ? segment.getChefSegment().getId() : null);
        dto.setActive(segment.isActive());
        return dto;
    }

    private boolean hasRole(UserEntity user, String roleName) {
        return user.getRoles().stream()
                .anyMatch(role -> roleName.equals(role.getName()));
    }

    @Override
    public ResponseEntity<byte[]> exportSegmentsToExcel() {
        List<SegmentDTO> segments = getAllActive();
        String[] headers = {"Name", "Cost Center", "SAP Reference", "Plant Section", "RH Segment", "Chef Segment"};
        Function<SegmentDTO, String[]> dataMapper = segment -> {
            String plantSectionName = "N/A";
            String rhSegmentName = "N/A";
            String chefSegmentName = "N/A";
            if (segment.getPlantSectionId() != null) {
                PlantSection plantSection = plantSectionRepository.findById(segment.getPlantSectionId())
                        .orElse(null);
                plantSectionName = plantSection != null ? plantSection.getName() : "N/A";
            }
            if (segment.getRhSegmentId() != null) {
                UserEntity rhSegment = userRepository.findById(segment.getRhSegmentId())
                        .orElse(null);
                rhSegmentName = rhSegment != null ? rhSegment.getFirstName() + " " + rhSegment.getLastName() : "N/A";
            }
            if (segment.getChefSegmentId() != null) {
                UserEntity chefSegment = userRepository.findById(segment.getChefSegmentId())
                        .orElse(null);
                chefSegmentName = chefSegment != null ? chefSegment.getFirstName() + " " + chefSegment.getLastName() : "N/A";
            }
            return new String[] {
                    segment.getSegment_name(),
                    segment.getCostCenter(),
                    segment.getSapRef(),
                    plantSectionName,
                    rhSegmentName,
                    chefSegmentName
            };
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(segments, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "segments.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}