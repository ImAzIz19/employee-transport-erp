package net.sindibadgroup.ltms.service.action;

import net.sindibadgroup.ltms.dto.action.UploadActionDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UploadActionService {

    List<UploadActionDTO> getAll();
    ResponseEntity<Resource> downloadFile(Integer id);
    List<UploadActionDTO> getAllEmployeeAction();
    List<UploadActionDTO> getAllStationAction();
}
