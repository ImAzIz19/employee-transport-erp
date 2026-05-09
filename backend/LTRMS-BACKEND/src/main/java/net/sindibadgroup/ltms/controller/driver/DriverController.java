package net.sindibadgroup.ltms.controller.driver;

import net.sindibadgroup.ltms.dto.driver.DriverDTO;
import net.sindibadgroup.ltms.exception.ResourceNotFoundException;
import net.sindibadgroup.ltms.service.driver.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping("/create")
//    @PreAuthorize("hasAuthority('driver:create')")
    public ResponseEntity<DriverDTO> createChauffeur(@Valid @RequestBody DriverDTO driverDTO) {
        return new ResponseEntity<>(driverService.createChauffeur(driverDTO), HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('driver:read')")
    public ResponseEntity<DriverDTO> getChauffeurById(@PathVariable Long id) {
        return ResponseEntity.ok(driverService.getChauffeurById(id).orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id)));
    }

    @GetMapping("/getAll")
//    @PreAuthorize("hasAuthority('driver:read')")
    public ResponseEntity<List<DriverDTO>> getAllChauffeurs() {
        return new ResponseEntity<>(driverService.getAllChauffeurs().reversed(), HttpStatus.OK);
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('driver:read')")
    public ResponseEntity<List<DriverDTO>> getAllActiveDrivers() {
        return new ResponseEntity<>(driverService.getAllActiveDrivers().reversed(), HttpStatus.OK);
    }

    @PutMapping("/modify/{id}")
//    @PreAuthorize("hasAuthority('driver:update')")
    public ResponseEntity<DriverDTO> updateChauffeur(@PathVariable Long id, @Valid @RequestBody DriverDTO driverDTO) {
        return new ResponseEntity<>(driverService.updateChauffeur(id, driverDTO), HttpStatus.OK);
    }

    @PutMapping("/activate/{id}")
    @PreAuthorize("hasAuthority('driver:update')")
    public ResponseEntity<DriverDTO> activateDriver(@PathVariable Long id) {
        return new ResponseEntity<>(driverService.activateDriver(id), HttpStatus.OK);
    }

    @PutMapping("/deactivate/{id}")
    @PreAuthorize("hasAuthority('driver:update')")
    public ResponseEntity<DriverDTO> deactivateDriver(@PathVariable Long id) {
        return new ResponseEntity<>(driverService.deactivateDriver(id), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('driver:delete')")
    public ResponseEntity<Void> deleteChauffeur(@PathVariable Long id) {
        driverService.deleteChauffeur(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('driver:export')")
    public ResponseEntity<byte[]> exportChauffeursToExcel() {
        return driverService.exportChauffeursToExcel();
    }
}