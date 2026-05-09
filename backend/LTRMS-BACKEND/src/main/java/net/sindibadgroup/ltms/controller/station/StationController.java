package net.sindibadgroup.ltms.controller.station;

import net.sindibadgroup.ltms.dto.station.StationDTO;
import net.sindibadgroup.ltms.dto.uploadResponse.FileVerificationDTO;
import net.sindibadgroup.ltms.service.file.FileService;
import net.sindibadgroup.ltms.service.station.StationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/station")
public class StationController {

    @Autowired
    private StationService stationService;

    @Autowired
    private FileService fileService;

    @GetMapping("/getAll")
//    @PreAuthorize("hasAuthority('station:read')")
    public ResponseEntity<List<StationDTO>> getAll() {
        return ResponseEntity.ok(stationService.getAll());
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('station:read')")
    public ResponseEntity<List<StationDTO>> getAllActive() {
        return ResponseEntity.ok(stationService.getAllActive());
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('station:read')")
    public ResponseEntity<StationDTO> get(@PathVariable Integer id) {
        return ResponseEntity.ok(stationService.get(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('station:create')")
    public ResponseEntity<StationDTO> create(@RequestBody StationDTO dto) {
        return ResponseEntity.ok(stationService.create(dto));
    }

    @PutMapping("/modify/{id}")
//    @PreAuthorize("hasAuthority('station:update')")
    public ResponseEntity<StationDTO> modify(@PathVariable Integer id, @RequestBody StationDTO dto) {
        return ResponseEntity.ok(stationService.modify(id, dto));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('station:status')")
    public ResponseEntity<StationDTO> activate(@PathVariable Integer id) {
        return ResponseEntity.ok(stationService.activate(id));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('station:status')")
    public ResponseEntity<StationDTO> deactivate(@PathVariable Integer id) {
        return ResponseEntity.ok(stationService.deactivate(id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('station:delete')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        stationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
    @PreAuthorize("hasAuthority('station:import')")
    public ResponseEntity<FileVerificationDTO> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return stationService.uploadFile(file);
    }

    @PostMapping("/verify")
    @PreAuthorize("hasAuthority('station:import')")
    public ResponseEntity<FileVerificationDTO> verifyFile(@RequestParam("file") MultipartFile file) throws IOException {
        return stationService.verifyFile(file);
    }

    @GetMapping("/template")
    @PreAuthorize("hasAuthority('station:export')")
    public ResponseEntity<Resource> downloadTemplate() {
        return fileService.downloadTemplate("station");
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('station:export')")
    public ResponseEntity<byte[]> exportStationsToExcel() {
        return stationService.exportStationsToExcel();
    }
}