package net.sindibadgroup.ltms.controller.vehicle;

import net.sindibadgroup.ltms.dto.vehicle.VehiculeDTO;
import net.sindibadgroup.ltms.exception.ResourceNotFoundException;
import net.sindibadgroup.ltms.service.vehicule.VehiculeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehiculeController {

    @Autowired
    private VehiculeService vehiculeService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('vehicle:create')")
    public ResponseEntity<VehiculeDTO> createVehicule(@Valid @RequestBody VehiculeDTO vehiculeDTO) {
        return new ResponseEntity<>(vehiculeService.createVehicule(vehiculeDTO), HttpStatus.CREATED);
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('vehicle:read')")
    public ResponseEntity<VehiculeDTO> getVehiculeById(@PathVariable Long id) {
        return ResponseEntity.ok(vehiculeService.getVehiculeById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicule not found with id: " + id)));
    }

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('vehicle:read')")
    public ResponseEntity<List<VehiculeDTO>> getAllVehicules() {
        return new ResponseEntity<>(vehiculeService.getAllVehicules().reversed(), HttpStatus.OK);
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('vehicle:read')")
    public ResponseEntity<List<VehiculeDTO>> getAllActiveVehicules() {
        return new ResponseEntity<>(vehiculeService.getAllActiveVehicules().reversed(), HttpStatus.OK);
    }

    @PutMapping("/modify/{id}")
    @PreAuthorize("hasAuthority('vehicle:update')")
    public ResponseEntity<VehiculeDTO> updateVehicule(@PathVariable Long id, @Valid @RequestBody VehiculeDTO vehiculeDTO) {
        return new ResponseEntity<>(vehiculeService.updateVehicule(id, vehiculeDTO), HttpStatus.OK);
    }

    @PutMapping("/activate/{id}")
    @PreAuthorize("hasAuthority('vehicle:update')")
    public ResponseEntity<VehiculeDTO> activateVehicule(@PathVariable Long id) {
        return new ResponseEntity<>(vehiculeService.activateVehicule(id), HttpStatus.OK);
    }

    @PutMapping("/deactivate/{id}")
    @PreAuthorize("hasAuthority('vehicle:update')")
    public ResponseEntity<VehiculeDTO> deactivateVehicule(@PathVariable Long id) {
        return new ResponseEntity<>(vehiculeService.deactivateVehicule(id), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('vehicle:delete')")
    public ResponseEntity<Void> deleteVehicule(@PathVariable Long id) {
        vehiculeService.deleteVehicule(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('vehicle:export')")
    public ResponseEntity<byte[]> exportVehiculesToExcel() {
        return vehiculeService.exportVehiculesToExcel();
    }
}