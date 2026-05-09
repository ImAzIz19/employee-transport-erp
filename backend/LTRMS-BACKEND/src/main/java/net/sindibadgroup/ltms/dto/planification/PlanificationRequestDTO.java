package net.sindibadgroup.ltms.dto.planification;


import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class PlanificationRequestDTO {
    @NotBlank
    private String week;

    private Integer plantSectionId;
    
    private MultipartFile file;

    private Integer userId ;
}