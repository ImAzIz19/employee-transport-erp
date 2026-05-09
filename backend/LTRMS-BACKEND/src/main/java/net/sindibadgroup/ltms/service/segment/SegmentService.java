package net.sindibadgroup.ltms.service.segment;

import net.sindibadgroup.ltms.dto.segment.SegmentDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SegmentService {
    List<SegmentDTO> getAll();
    List<SegmentDTO> getAllActive();
    SegmentDTO get(Integer id);
    SegmentDTO create(SegmentDTO dto);
    SegmentDTO modify(Integer id, SegmentDTO dto);
    SegmentDTO activate(Integer id);
    SegmentDTO deactivate(Integer id);
    void delete(Integer id);
    ResponseEntity<byte[]> exportSegmentsToExcel();
}