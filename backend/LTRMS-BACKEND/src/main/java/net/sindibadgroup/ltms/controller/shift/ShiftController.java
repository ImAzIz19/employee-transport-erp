package net.sindibadgroup.ltms.controller.shift;

import net.sindibadgroup.ltms.dto.shift.ShiftDTO;
import net.sindibadgroup.ltms.service.shift.ShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shifts")
@RequiredArgsConstructor
public class ShiftController {

    private final ShiftService shiftService;

    @GetMapping("/get-all")
    public ResponseEntity<List<ShiftDTO>> getAllShifts() {
        return ResponseEntity.ok(shiftService.getAllShifts());
    }

    @PostMapping("/add")
    public ResponseEntity<ShiftDTO> addShift(@RequestBody ShiftDTO shiftDTO) {
        return ResponseEntity.status(201).body(shiftService.addShift(shiftDTO));
    }

    @PutMapping("/modify/{id}")
    public ResponseEntity<ShiftDTO> modifyShift(@PathVariable Integer id, @RequestBody ShiftDTO shiftDTO) {
        return ResponseEntity.ok(shiftService.modifyShift(id, shiftDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteShift(@PathVariable Integer id) {
        shiftService.deleteShift(id);
        return ResponseEntity.ok("a shift has been deleted");
    }
}