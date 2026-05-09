package net.sindibadgroup.ltms.controller.planification;

import net.sindibadgroup.ltms.dto.agency.AgencyNotifRequestDTO;
import net.sindibadgroup.ltms.dto.planification.ManualPlanificationDTO;
import net.sindibadgroup.ltms.dto.planification.PlanificationRequestDTO;
import net.sindibadgroup.ltms.service.file.FileService;
import net.sindibadgroup.ltms.service.planification.PlanificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/planifications")
@Validated
public class PlanificationController {

    @Autowired
    private PlanificationService planificationService;

    @Autowired
    private FileService fileService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('planification:read')")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(planificationService.getAll());
    }

    @PostMapping("/upload/cum")
//    @PreAuthorize("hasAuthority('planification:create')")
    public ResponseEntity<?> uploadFileCum(@Valid @ModelAttribute PlanificationRequestDTO requestDTO) throws IOException {
        return planificationService.createPlanificationCum(requestDTO);
    }

    @PostMapping("/upload/ecras")
//    @PreAuthorize("hasAuthority('planification:create')")
    public ResponseEntity<?> uploadFileEcras(@Valid @ModelAttribute PlanificationRequestDTO requestDTO) throws IOException {
        return planificationService.createPlanificationEcras(requestDTO);
    }

    @GetMapping("/template")
//    @PreAuthorize("hasAuthority('planification:export')")
    public ResponseEntity<?> downloadTemplate() {
        return fileService.downloadTemplate("planification");
    }

    @PostMapping("/manual")
//    @PreAuthorize("hasAuthority('planification:manual')")
    public ResponseEntity<?> manualPlanification(@Valid @RequestBody ManualPlanificationDTO requestDTO) throws IOException {
        return planificationService.manualPlanification(requestDTO);
    }

    @PostMapping("/send-agency-notification")
//    @PreAuthorize("hasAuthority('planification:notification')")
    public ResponseEntity<?> sendAgencyNotification(@Valid @ModelAttribute AgencyNotifRequestDTO requestDTO) throws IOException {
        return planificationService.sendAgencyNotification(requestDTO);
    }
}