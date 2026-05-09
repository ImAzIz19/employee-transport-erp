package net.sindibadgroup.ltms.controller.segment;

import net.sindibadgroup.ltms.dto.segment.SegmentDTO;
import net.sindibadgroup.ltms.service.segment.SegmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/segments")
public class SegmentController {

    @Autowired
    private SegmentService segmentService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('segment:read')")
    public ResponseEntity<List<SegmentDTO>> getAll() {
        List<SegmentDTO> segments = segmentService.getAll();
        return ResponseEntity.ok(segments);
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('segment:read')")
    public ResponseEntity<List<SegmentDTO>> getAllActive() {
        List<SegmentDTO> segments = segmentService.getAllActive();
        return ResponseEntity.ok(segments);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('segment:read')")
    public ResponseEntity<SegmentDTO> get(@PathVariable Integer id) {
        SegmentDTO segment = segmentService.get(id);
        return ResponseEntity.ok(segment);
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('segment:create')")
    public ResponseEntity<SegmentDTO> create(@RequestBody SegmentDTO dto) {
        SegmentDTO createdSegment = segmentService.create(dto);
        return ResponseEntity.ok(createdSegment);
    }

    @PutMapping("/modify/{id}")
    @PreAuthorize("hasAuthority('segment:update')")
    public ResponseEntity<SegmentDTO> modify(
            @PathVariable Integer id,
            @RequestBody SegmentDTO dto) {
        SegmentDTO updatedSegment = segmentService.modify(id, dto);
        return ResponseEntity.ok(updatedSegment);
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('segment:status')")
    public ResponseEntity<SegmentDTO> activate(@PathVariable Integer id) {
        SegmentDTO activatedSegment = segmentService.activate(id);
        return ResponseEntity.ok(activatedSegment);
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('segment:status')")
    public ResponseEntity<SegmentDTO> deactivate(@PathVariable Integer id) {
        SegmentDTO deactivatedSegment = segmentService.deactivate(id);
        return ResponseEntity.ok(deactivatedSegment);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('segment:delete')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        segmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('segment:export')")
    public ResponseEntity<byte[]> exportSegmentsToExcel() {
        return segmentService.exportSegmentsToExcel();
    }
}