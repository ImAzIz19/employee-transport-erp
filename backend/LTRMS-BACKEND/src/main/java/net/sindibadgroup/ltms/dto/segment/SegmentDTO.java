package net.sindibadgroup.ltms.dto.segment;

import lombok.Data;

@Data
public class SegmentDTO {
    private Integer id;
    private String segment_name;
    private String costCenter;
    private String sapRef;
    private Integer plantSectionId;
    private Integer rhSegmentId;
    private Integer chefSegmentId;
    private boolean isActive;
}