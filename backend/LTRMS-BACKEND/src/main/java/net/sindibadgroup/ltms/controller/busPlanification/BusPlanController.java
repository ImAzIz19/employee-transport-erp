package net.sindibadgroup.ltms.controller.busPlanification;

import net.sindibadgroup.ltms.dto.planification.BusPlanDTO;
import net.sindibadgroup.ltms.dto.planification.BusPlanRequestDTO;
import net.sindibadgroup.ltms.service.busPlanification.BusPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bus-plans")
public class BusPlanController {
    @Autowired
    private BusPlanService busPlanService;

    @PostMapping("/search")
    public ResponseEntity<List<BusPlanDTO>> getAllByWeek(@RequestBody BusPlanRequestDTO requestDTO) {
        return ResponseEntity.ok(busPlanService.getAllByWeek(requestDTO));
    }

    @PostMapping("/search-by-agency")
    public ResponseEntity<List<BusPlanDTO>> getByAgency(@RequestBody BusPlanRequestDTO requestDTO) {
        return ResponseEntity.ok(busPlanService.getByAgency(requestDTO));
    }

    @PutMapping("/modify")
    public ResponseEntity<BusPlanDTO> modifyBusPlan(@RequestBody BusPlanRequestDTO requestDTO) {
        return ResponseEntity.ok(busPlanService.modifyBusPlan(requestDTO));
    }

    @GetMapping("/notify-Agency")
    public ResponseEntity<?> notifyAgency(
            @RequestParam("agencyId") Long agencyId,
            @RequestParam("week") String week) {
        busPlanService.exportBusPlansToExcel(agencyId, week);
        return ResponseEntity.ok("Bus plan exported and emailed successfully");
    }
}