package net.sindibadgroup.ltms.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO {
    private Integer id;
    private long serialNumber;
    private String firstName;
    private String lastName;
    private String againstMaster;
    private String groupName;
    private Integer plantSectionId;
    private int phoneNumber;
    private int costCenter;
    private Integer stationId;
    private Integer segmentId;
    private String regions;
    private String segments;
    private boolean isActive;
    private boolean isActiveForPlanification ;
    private boolean direct ;
}
