package net.sindibadgroup.ltms.service.planification;

import net.sindibadgroup.ltms.dto.agency.AgencyNotifRequestDTO;
import net.sindibadgroup.ltms.dto.planification.ManualPlanificationDTO;
import net.sindibadgroup.ltms.dto.planification.PlanificationRequestDTO;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.util.List;

public interface PlanificationService {
    List<?> getAll();
    ResponseEntity<?> createPlanificationCum(PlanificationRequestDTO requestDTO) throws IOException;
    ResponseEntity<?> manualPlanification(ManualPlanificationDTO requestDTO) throws IOException ;
    ResponseEntity<?> createPlanificationEcras(PlanificationRequestDTO requestDTO) throws IOException;
    ResponseEntity<?> sendAgencyNotification(AgencyNotifRequestDTO requestDTO) throws IOException;
}