package net.sindibadgroup.ltms.controller.agency;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import net.sindibadgroup.ltms.exception.ResourceNotFoundException;
import net.sindibadgroup.ltms.service.agency.AgencyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
public class AgencyController {

    @Autowired
    private AgencyService agencyService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('agency:create')")
    public ResponseEntity<AgencyDTO> createAgence(@Valid @RequestBody AgencyDTO agencyDTO) {
        return new ResponseEntity<>(agencyService.createAgence(agencyDTO), HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('agency:read')")
    public ResponseEntity<AgencyDTO> getAgenceById(@PathVariable Long id) {
        return ResponseEntity.ok(agencyService.getAgenceById(id).orElseThrow(() -> new ResourceNotFoundException("Agency not found with id: " + id)));
    }

    @GetMapping("/getAll")
//    @PreAuthorize("hasAuthority('agency:read')")
    public ResponseEntity<List<AgencyDTO>> getAllAgences() {
        return new ResponseEntity<>(agencyService.getAllAgences().reversed(), HttpStatus.OK);
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('agency:read')")
    public ResponseEntity<List<AgencyDTO>> getAllActiveAgencies() {
        return new ResponseEntity<>(agencyService.getAllActiveAgencies().reversed(), HttpStatus.OK);
    }

    @PutMapping("/modify/{id}")
//    @PreAuthorize("hasAuthority('agency:update')")
    public ResponseEntity<AgencyDTO> updateAgence(@PathVariable Long id, @Valid @RequestBody AgencyDTO agencyDTO) {
        return new ResponseEntity<>(agencyService.updateAgence(id, agencyDTO), HttpStatus.OK);
    }

    @PutMapping("/activate/{id}")
    @PreAuthorize("hasAuthority('agency:update')")
    public ResponseEntity<AgencyDTO> activateAgency(@PathVariable Long id) {
        return new ResponseEntity<>(agencyService.activateAgency(id), HttpStatus.OK);
    }

    @PutMapping("/deactivate/{id}")
    @PreAuthorize("hasAuthority('agency:update')")
    public ResponseEntity<AgencyDTO> deactivateAgency(@PathVariable Long id) {
        return new ResponseEntity<>(agencyService.deactivateAgency(id), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
//    @PreAuthorize("hasAuthority('agency:delete')")
    public ResponseEntity<Void> deleteAgence(@PathVariable Long id) {
        agencyService.deleteAgence(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('agency:read')")
    public ResponseEntity<byte[]> exportAgencesToExcel() {
        return agencyService.exportAgencesToExcel();
    }
}