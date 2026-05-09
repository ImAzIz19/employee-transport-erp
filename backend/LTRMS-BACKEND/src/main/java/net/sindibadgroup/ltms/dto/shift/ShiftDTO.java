package net.sindibadgroup.ltms.dto.shift;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShiftDTO {
    private Integer id;
    private String startTime;
    private String endTime;
    private String mode;
}