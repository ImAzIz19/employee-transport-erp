package net.sindibadgroup.ltms.controller.action;

import net.sindibadgroup.ltms.dto.action.UploadActionDTO;
import net.sindibadgroup.ltms.service.action.UploadActionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/upload-actions")
public class UploadActionController {

    @Autowired
    private UploadActionService uploadActionService;

    @GetMapping("/all")
    public ResponseEntity<List<UploadActionDTO>> getAll() {
        return ResponseEntity.ok(uploadActionService.getAll());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Integer id) {
        return uploadActionService.downloadFile(id);
    }

    @GetMapping("/employee")
    public List<UploadActionDTO> getAllEmployeeAction() {
        return uploadActionService.getAllEmployeeAction();
    }

    @GetMapping("/station")
    public List<UploadActionDTO> getAllStationAction() {
        return uploadActionService.getAllStationAction();
    }
}
