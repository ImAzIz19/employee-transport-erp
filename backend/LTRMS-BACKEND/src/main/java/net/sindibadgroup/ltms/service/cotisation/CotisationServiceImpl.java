package net.sindibadgroup.ltms.service.cotisation;

import com.fasterxml.jackson.databind.ObjectMapper;
import net.sindibadgroup.ltms.model.employee.Employee;
import net.sindibadgroup.ltms.model.employee.EmployeePlans;
import net.sindibadgroup.ltms.repository.EmployeeRepository;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.repository.PlantSectionRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CotisationServiceImpl implements CotisationService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PlantSectionRepository plantSectionRepository;

    @Override
    public ResponseEntity<?> importExonerationData(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                return ResponseEntity.badRequest().body("{\"error\": \"Header row is missing in the Excel file\"}");
            }

            String[] expectedHeaders = {"Matricule", "PRENOM", "NOM", "Collaborateur", "EXONORES"};
            String[] actualHeaders = new String[headerRow.getLastCellNum()];
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                Cell cell = headerRow.getCell(i);
                actualHeaders[i] = cell != null && cell.getCellType() != CellType.BLANK ? cell.getStringCellValue().trim() : "";
            }

            if (!Arrays.equals(expectedHeaders, actualHeaders)) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("error", "Invalid headers. Expected: " + Arrays.toString(expectedHeaders) + ", Found: " + Arrays.toString(actualHeaders));
                return ResponseEntity.badRequest().body(new ObjectMapper().writeValueAsString(errorResponse));
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }

                Cell matriculeCell = row.getCell(0);
                if (matriculeCell == null || matriculeCell.getCellType() == CellType.BLANK) {
                    continue;
                }

                long serialNumber;
                try {
                    if (matriculeCell.getCellType() == CellType.NUMERIC) {
                        serialNumber = (long) matriculeCell.getNumericCellValue();
                    } else {
                        serialNumber = Long.parseLong(matriculeCell.getStringCellValue().trim());
                    }
                } catch (NumberFormatException e) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Invalid Matricule value at row " + (i + 1));
                    return ResponseEntity.badRequest().body(new ObjectMapper().writeValueAsString(errorResponse));
                }

                Optional<Employee> employeeOpt = employeeRepository.findBySerialNumber(serialNumber);
                if (!employeeOpt.isPresent()) {
                    Map<String, String> errorResponse = new HashMap<>();
                    errorResponse.put("error", "Employee with serialNumber " + serialNumber + " not found at row " + (i + 1));
                    return ResponseEntity.badRequest().body(new ObjectMapper().writeValueAsString(errorResponse));
                }

                Cell exonoCell = row.getCell(4);
                boolean exonerated = false;
                if (exonoCell != null && exonoCell.getCellType() != CellType.BLANK) {
                    String exonoValue = exonoCell.getStringCellValue().trim().toUpperCase();
                    exonerated = "OUI".equals(exonoValue);
                }

                Employee employee = employeeOpt.get();
                employee.setExonerated(exonerated);
                employeeRepository.save(employee);
            }

            return ResponseEntity.ok("{\"message\": \"File imported successfully\"}");
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Error processing file: " + e.getMessage());
            try {
                return ResponseEntity.badRequest().body(new ObjectMapper().writeValueAsString(errorResponse));
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body("{\"error\": \"Error processing file\"}");
            }
        }
    }

    @Override
    public ResponseEntity<byte[]> getEmployeesByPlantSectionAndPeriod(int month, int year, int psId) {
        try {
            if (month < 1 || month > 12) {
                return ResponseEntity.badRequest().body(null);
            }
            if (year < 1900 || year > 9999) {
                return ResponseEntity.badRequest().body(null);
            }
            if (psId <= 0) {
                return ResponseEntity.badRequest().body(null);
            }

            Optional<PlantSection> plantSectionOpt = plantSectionRepository.findById(psId);
            if (!plantSectionOpt.isPresent()) {
                return ResponseEntity.badRequest().body(null);
            }
            PlantSection plantSection = plantSectionOpt.get();

            List<Employee> employees = employeeRepository.findAll().stream()
                    .filter(employee -> employee.getPlantSection() != null && employee.getPlantSection().getId() == psId)
                    .filter(employee -> employee.getEmployeePlans().stream()
                            .anyMatch(plan -> plan.getMonth() == month && plan.getYear() == year))
                    .collect(Collectors.toList());

            Workbook workbook = new XSSFWorkbook();
            Sheet sheet = workbook.createSheet("Employees");

            Row orgRow = sheet.createRow(0);
            orgRow.createCell(0).setCellValue("Organization:");
            orgRow.createCell(1).setCellValue("LEONI");

            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");

            Row startDateRow = sheet.createRow(1);
            startDateRow.createCell(0).setCellValue("Date Debut:");
            startDateRow.createCell(1).setCellValue(startDate.format(formatter));

            Row endDateRow = sheet.createRow(2);
            endDateRow.createCell(0).setCellValue("Date Fin:");
            endDateRow.createCell(1).setCellValue(endDate.format(formatter));

            Row psRow = sheet.createRow(3);
            psRow.createCell(0).setCellValue("PS:");
            psRow.createCell(1).setCellValue("LEONI/" + plantSection.getName());

            Row emptyRow = sheet.createRow(4);

            String[] headers = {"Matricule", "Collaborateur", "Section", "Segment", "Circuit", "Cotisation", "Exonoration"};
            Row headerRow = sheet.createRow(5);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowNum = 6;
            for (Employee employee : employees) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(employee.getSerialNumber());
                row.createCell(1).setCellValue(employee.getFirstName() + " " + employee.getLastName());
                row.createCell(2).setCellValue(employee.getPlantSection() != null ? employee.getPlantSection().getName() : "");
                row.createCell(3).setCellValue(employee.getSegment() != null ? employee.getSegment().getName() : "");
                row.createCell(4).setCellValue(employee.getStation() != null && employee.getStation().getCircuit() != null ? employee.getStation().getCircuit().getPathReference() : "");
                row.createCell(5).setCellValue(employee.getCostCenter());
                row.createCell(6).setCellValue(employee.isExonerated() ? "OUI" : "");
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();

            HttpHeaders headersResponse = new HttpHeaders();
            headersResponse.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headersResponse.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employees_" + year + "_" + month + "_" + psId + ".xlsx");

            return ResponseEntity.ok()
                    .headers(headersResponse)
                    .body(outputStream.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}