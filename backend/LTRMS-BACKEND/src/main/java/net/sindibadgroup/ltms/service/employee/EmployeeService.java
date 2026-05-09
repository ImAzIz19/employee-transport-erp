package net.sindibadgroup.ltms.service.employee;

import net.sindibadgroup.ltms.dto.uploadResponse.FileVerificationDTO;
import net.sindibadgroup.ltms.dto.employee.EmployeeDTO;
import net.sindibadgroup.ltms.dto.uploadResponse.UploadResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface EmployeeService {
    List<EmployeeDTO> getAll();
    List<EmployeeDTO> getAllActive();
    EmployeeDTO get(Integer id);
    EmployeeDTO create(EmployeeDTO dto);
    EmployeeDTO modify(Integer id, EmployeeDTO dto);
    EmployeeDTO activate(Integer id);
    EmployeeDTO deactivate(Integer id);
    void delete(Integer id);
    ResponseEntity<UploadResponse> uploadFile(MultipartFile file) throws IOException;
    ResponseEntity<FileVerificationDTO> verifyFile(MultipartFile file) throws IOException;
    ResponseEntity<byte[]> exportEmployeesToExcel();
}