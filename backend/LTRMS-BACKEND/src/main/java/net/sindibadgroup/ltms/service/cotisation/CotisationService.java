package net.sindibadgroup.ltms.service.cotisation;

import net.sindibadgroup.ltms.model.employee.Employee;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CotisationService {
    ResponseEntity<?> importExonerationData(MultipartFile file);
    ResponseEntity<byte[]> getEmployeesByPlantSectionAndPeriod(int month, int year, int psId);
}