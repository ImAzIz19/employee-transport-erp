package net.sindibadgroup.ltms.model.planification;

import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.segment.Segment;
import jakarta.persistence.*;
import lombok.*;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "planification")
public class Planification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String week ;

    private Date actionDate ;

    private String userName ; //"ADMIN" ALLWAYS

    private String actionName ;//"PLANNING_UPLOAD_ACTION" ALLWAYS

    private String targetAction ; // "Week-Planning" allways

    private String targetActionVariant ; // "IMPORT WITH OVERWRITING" allways

    private String orgName ;//"LTRMS" allways

    @ManyToOne
    private PlantSection plantSection; // could be null

    @OneToOne
    private Segment segment ;

    private int actionId ;

    private int totalLines ;

    private int emplyeesNotActifForPlanification ; // they exist but their isActiveForPlanification is false

    private int successSaved; //number of succes emplyee that have no probelm their matricule found and isActiveForPlanification

    private int nonExistentEmployees; //number of succes emplyee that their matricule do not exisit in data base

    private int invalidDays; // number of employees  that have  at least one unvalid time, the time should be in that format "hh:mm hh:mm" or "repos"

}
