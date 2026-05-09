package net.sindibadgroup.ltms.dto.plant_section;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlantSectionDTO {
    private Integer id;
    private String plantsection_name;
    private String description;
    private String emplacement;
    private Integer psManagerId;
    private Integer rhManagerId;
    private String organization;
    private boolean isActive;
    private Set<Integer> segmentIds;
}