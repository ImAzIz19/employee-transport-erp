package net.sindibadgroup.ltms.dto.planification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BusPlanDTO {
    private int id;
    private String agencyName;
    private String circuitName;
    private String weekDay;
    private String date;
    private String startTime;
    private String endTime;
    private int numberOfEmployees;
    private int numberOfStandardBuses;
    private int numberOfMiniBuses;
}