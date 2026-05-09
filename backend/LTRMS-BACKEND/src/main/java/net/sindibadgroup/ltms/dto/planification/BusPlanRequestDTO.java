package net.sindibadgroup.ltms.dto.planification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BusPlanRequestDTO {
    private Integer busPlanId;
    private String week;
    private Long agencyId;

    private List<String> weekdays ; //could be null
    private List<Integer> shiftsIds ; // could be null
    private List<Integer> circuitIds ; // could be null
    //when i remove this three i get the result
    // i want to filter the data based on this three but when i dont have
    // a value for one or all of them u just gave me all the plans
    // the hole research based on week string



    private Integer numberOfStandardBuses; // For modify operation
    private Integer numberOfMiniBuses; // For modify operation
}