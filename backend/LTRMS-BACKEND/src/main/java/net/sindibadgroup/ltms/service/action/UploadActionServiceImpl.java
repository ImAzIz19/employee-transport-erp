package net.sindibadgroup.ltms.service.action;

import net.sindibadgroup.ltms.dto.action.UploadActionDTO;
import net.sindibadgroup.ltms.dto.action.UploadActionDTOMapper;
import net.sindibadgroup.ltms.model.action.UploadAction;
import net.sindibadgroup.ltms.repository.UploadActionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UploadActionServiceImpl implements UploadActionService {

    @Autowired
    private UploadActionRepository uploadActionRepository;

    @Autowired
    private UploadActionDTOMapper uploadActionDTOMapper;

    @Value("${file.upload-dir:/Uploads}")
    private String uploadDir;

    @Override
    public List<UploadActionDTO> getAll() {
        return uploadActionRepository.findAll().stream()
                .map(uploadActionDTOMapper)
                .collect(Collectors.toList());
    }

    public ResponseEntity<Resource> downloadFile(Integer id) {
        UploadAction action = uploadActionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Action not found for ID: " + id));

        String fileName;
        switch (action.getTargetAction()) {
            case "EMPLOYEE":
                fileName = "employees.xlsx";
                break;
            case "STATION":
                fileName = "stations.xlsx";
                break;
            case "PLANIFICATION":
                fileName = "planifications.xlsx";
                break;
            default:
                fileName = "action_" + id + ".xlsx";
        }

        String filePath = uploadDir + "/action_" + id + ".xlsx";
        FileSystemResource resource = new FileSystemResource(filePath);
        if (!resource.exists()) {
            throw new RuntimeException("File not found for action ID: " + id);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @Override
    public List<UploadActionDTO> getAllEmployeeAction() {
        return uploadActionRepository.findByTargetAction("EMPLOYEE").stream()
                .map(uploadActionDTOMapper)
                .collect(Collectors.toList());
    }

    @Override
    public List<UploadActionDTO> getAllStationAction() {
        return uploadActionRepository.findByTargetAction("STATION").stream()
                .map(uploadActionDTOMapper)
                .collect(Collectors.toList());
    }
}