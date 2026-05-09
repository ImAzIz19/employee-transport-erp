package net.sindibadgroup.ltms.dto.agency;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AgencyNotifRequestDTO {

    private String agencyEmail ;

    private String week ;

    private MultipartFile file;

}
