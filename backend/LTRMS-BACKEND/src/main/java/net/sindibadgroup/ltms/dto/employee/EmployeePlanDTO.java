package net.sindibadgroup.ltms.dto.employee;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeePlanDTO {
    private long matricule;
    private String fullName;
    private String week;
    private String[] shifts;
}