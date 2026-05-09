package net.sindibadgroup.ltms.dto.planification;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ManualPlanificationDTO {
    private String week;
    private long plantSectionId;
    private long matricule;
}