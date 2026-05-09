package net.sindibadgroup.ltms.dto.station;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StationDTO {
    private Integer id;
    private String refRegion;
    private Double refSapLeoni;
    private double longitude;
    private double latitude;
    private double radius;
    private boolean isActive;
    private Integer circuitId;
}