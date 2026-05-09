package net.sindibadgroup.ltms.dto.planification;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlanificationDTO {
    private Integer id;
    private String week;
    private String userName;
    private String actionName;
    private String targetAction;
    private String targetActionVariant;
    private String orgName;
    private String plantSectionName;
    private String segmentName;
    private int totalLines;
    private int actionId ;
    private int emplyeesNotActifForPlanification ; // they exist but their isActiveForPlanification is false
    private int successSaved; //number of succes emplyee that have no probelm their matricule found and isActiveForPlanification
    private int nonExistentEmployees; //number of succes emplyee that their matricule do not exisit in data base
    private int invalidDays; // number of employees  that have  at least one unvalid time, the time should be in that format "hh:mm hh:mm" or "repos"

}