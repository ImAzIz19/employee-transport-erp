package net.sindibadgroup.ltms.controller.circuit;

import net.sindibadgroup.ltms.dto.circuit.CircuitDTO;
import net.sindibadgroup.ltms.service.circuit.CircuitService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/circuits")
public class CircuitController {

    @Autowired
    private CircuitService circuitService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('circuit:read')")
    public ResponseEntity<List<CircuitDTO>> getAll() {
        return ResponseEntity.ok(circuitService.getAll());
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('circuit:read')")
    public ResponseEntity<List<CircuitDTO>> getAllActive() {
        return ResponseEntity.ok(circuitService.getAllActive());
    }

    @GetMapping("/get/{id}")
    @PreAuthorize("hasAuthority('circuit:read')")
    public ResponseEntity<CircuitDTO> get(@PathVariable Integer id) {
        return ResponseEntity.ok(circuitService.get(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('circuit:create')")
    public ResponseEntity<CircuitDTO> create(@Valid @RequestBody CircuitDTO dto) {
        return ResponseEntity.ok(circuitService.create(dto));
    }

    @PutMapping("/modify/{id}")
    @PreAuthorize("hasAuthority('circuit:update')")
    public ResponseEntity<CircuitDTO> modify(@PathVariable Integer id, @Valid @RequestBody CircuitDTO dto) {
        return ResponseEntity.ok(circuitService.modify(id, dto));
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasAuthority('circuit:status')")
    public ResponseEntity<CircuitDTO> activate(@PathVariable Integer id) {
        return ResponseEntity.ok(circuitService.activate(id));
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('circuit:status')")
    public ResponseEntity<CircuitDTO> deactivate(@PathVariable Integer id) {
        return ResponseEntity.ok(circuitService.deactivate(id));
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('circuit:delete')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        circuitService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export/excel")
    @PreAuthorize("hasAuthority('circuit:export')")
    public ResponseEntity<byte[]> exportCircuitsToExcel() {
        return circuitService.exportCircuitsToExcel();
    }
}