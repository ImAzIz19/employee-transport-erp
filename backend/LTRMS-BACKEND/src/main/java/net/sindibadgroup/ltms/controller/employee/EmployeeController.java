package net.sindibadgroup.ltms.controller.employee;

import net.sindibadgroup.ltms.dto.uploadResponse.FileVerificationDTO;
import net.sindibadgroup.ltms.dto.employee.EmployeeDTO;
import net.sindibadgroup.ltms.dto.uploadResponse.UploadResponse;
import net.sindibadgroup.ltms.service.employee.EmployeeService;
import net.sindibadgroup.ltms.service.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private FileService fileService;

    @GetMapping("/getAll")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<List<EmployeeDTO>> getAll() {
        return ResponseEntity.ok(employeeService.getAll());
    }

    @GetMapping("/getAllActive")
    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<List<EmployeeDTO>> getAllActive() {
        return ResponseEntity.ok(employeeService.getAllActive());
    }

    @GetMapping("/get/{id}")
//    @PreAuthorize("hasAuthority('employee:read')")
    public ResponseEntity<EmployeeDTO> get(@PathVariable Integer id) {
        return ResponseEntity.ok(employeeService.get(id));
    }

    @PostMapping("/create")
//    @PreAuthorize("hasAuthority('employee:create')")
    public ResponseEntity<EmployeeDTO> create(@RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.create(dto));
    }

    @PutMapping("/modify/{id}")
//    @PreAuthorize("hasAuthority('employee:update')")
    public ResponseEntity<EmployeeDTO> modify(@PathVariable Integer id, @RequestBody EmployeeDTO dto) {
        return ResponseEntity.ok(employeeService.modify(id, dto));
    }

    @PutMapping("/{id}/activate")
//    @PreAuthorize("hasAuthority('employee:status')")
    public ResponseEntity<EmployeeDTO> activate(@PathVariable Integer id) {
        return ResponseEntity.ok(employeeService.activate(id));
    }

    @PutMapping("/{id}/deactivate")
//    @PreAuthorize("hasAuthority('employee:status')")
    public ResponseEntity<EmployeeDTO> deactivate(@PathVariable Integer id) {
        return ResponseEntity.ok(employeeService.deactivate(id));
    }

    @DeleteMapping("/delete/{id}")
//    @PreAuthorize("hasAuthority('employee:delete')")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/upload")
//    @PreAuthorize("hasAuthority('employee:import')")
    public ResponseEntity<UploadResponse> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        return employeeService.uploadFile(file);
    }

    @PostMapping("/verify")
//    @PreAuthorize("hasAuthority('employee:import')")
    public ResponseEntity<FileVerificationDTO> verifyFile(@RequestParam("file") MultipartFile file) throws IOException {
        return employeeService.verifyFile(file);
    }

    @GetMapping("/template")
//    @PreAuthorize("hasAuthority('employee:export')")
    public ResponseEntity<Resource> downloadTemplate() {
        return fileService.downloadTemplate("employee");
    }

    @GetMapping("/export/excel")
//    @PreAuthorize("hasAuthority('employee:export')")
    public ResponseEntity<byte[]> exportEmployeesToExcel() {
        return employeeService.exportEmployeesToExcel();
    }
}