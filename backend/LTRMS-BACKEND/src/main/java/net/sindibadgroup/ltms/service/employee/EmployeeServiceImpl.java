package net.sindibadgroup.ltms.service.employee;

import net.sindibadgroup.ltms.dto.uploadResponse.FileVerificationDTO;
import net.sindibadgroup.ltms.dto.employee.EmployeeDTO;
import net.sindibadgroup.ltms.dto.uploadResponse.UploadResponse;
import net.sindibadgroup.ltms.model.action.UploadAction;
import net.sindibadgroup.ltms.model.employee.Employee;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.segment.Segment;
import net.sindibadgroup.ltms.model.station.Station;
import net.sindibadgroup.ltms.repository.*;
import net.sindibadgroup.ltms.service.email.EmailSenderService;
import net.sindibadgroup.ltms.service.file.FileService;
import net.sindibadgroup.ltms.util.FileProcessingUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static net.sindibadgroup.ltms.util.ExcelProcessingUtil.EXPECTED_HEADERS;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PlantSectionRepository plantSectionRepository;

    @Autowired
    private SegmentRepository segmentRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private UploadActionRepository uploadActionRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private FileService fileService;

    @Value("${file.upload-dir:/Uploads}")
    private String uploadDir;

    @Override
    public List<EmployeeDTO> getAll() {
        return employeeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EmployeeDTO> getAllActive() {
        return employeeRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EmployeeDTO get(Integer id) {
        return employeeRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    @Override
    public EmployeeDTO create(EmployeeDTO dto) {
        Employee employee = new Employee();
        if (dto.getPlantSectionId() == null) throw new RuntimeException("Plant Section ID is required");
        PlantSection plantSection = plantSectionRepository.findById(dto.getPlantSectionId())
                .orElseThrow(() -> new RuntimeException("Plant Section not found"));
        employee.setPlantSection(plantSection);

        if (dto.getSegmentId() != null) {
            Segment segment = segmentRepository.findById(dto.getSegmentId())
                    .orElseThrow(() -> new RuntimeException("Segment not found"));
            employee.setSegment(segment);
        }

        if (dto.getStationId() != null) {
            Station station = stationRepository.findById(dto.getStationId())
                    .orElseThrow(() -> new RuntimeException("Station not found"));
            employee.setStation(station);
        }

        employee.setSerialNumber(dto.getSerialNumber());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setAgainstMaster(dto.getAgainstMaster());
        employee.setGroupName(dto.getGroupName());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setCostCenter(dto.getCostCenter());
        employee.setDirect(dto.isDirect());
        employee.setActiveForPlanification(dto.isActiveForPlanification());

        return convertToDTO(employeeRepository.save(employee));
    }

    @Override
    public EmployeeDTO modify(Integer id, EmployeeDTO dto) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));

        if (dto.getPlantSectionId() != null) {
            PlantSection plantSection = plantSectionRepository.findById(dto.getPlantSectionId())
                    .orElseThrow(() -> new RuntimeException("Plant Section not found"));
            employee.setPlantSection(plantSection);
        }

        if (dto.getSegmentId() != null) {
            Segment segment = segmentRepository.findById(dto.getSegmentId())
                    .orElseThrow(() -> new RuntimeException("Segment not found"));
            employee.setSegment(segment);
        }

        if (dto.getStationId() != null) {
            Station station = stationRepository.findById(dto.getStationId())
                    .orElseThrow(() -> new RuntimeException("Station not found"));
            employee.setStation(station);
        }

        employee.setSerialNumber(dto.getSerialNumber());
        employee.setFirstName(dto.getFirstName());
        employee.setLastName(dto.getLastName());
        employee.setAgainstMaster(dto.getAgainstMaster());
        employee.setGroupName(dto.getGroupName());
        employee.setPhoneNumber(dto.getPhoneNumber());
        employee.setCostCenter(dto.getCostCenter());
        employee.setDirect(dto.isDirect());

        return convertToDTO(employeeRepository.save(employee));
    }

    @Override
    public EmployeeDTO activate(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setActive(true);
        return convertToDTO(employeeRepository.save(employee));
    }

    @Override
    public EmployeeDTO deactivate(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        employee.setActive(false);
        return convertToDTO(employeeRepository.save(employee));
    }

    @Override
    public void delete(Integer id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        if (employee.isActive()) throw new RuntimeException("Cannot delete active Employee. Deactivate first.");
        employeeRepository.delete(employee);
    }

    private EmployeeDTO convertToDTO(Employee employee) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(employee.getId());
        dto.setSerialNumber(employee.getSerialNumber());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setAgainstMaster(employee.getAgainstMaster());
        dto.setGroupName(employee.getGroupName());
        dto.setPlantSectionId(employee.getPlantSection() != null ? employee.getPlantSection().getId() : null);
        dto.setPhoneNumber(employee.getPhoneNumber());
        dto.setCostCenter(employee.getCostCenter());
        dto.setStationId(employee.getStation() != null ? employee.getStation().getId() : null);
        dto.setSegmentId(employee.getSegment() != null ? employee.getSegment().getId() : null);
        dto.setActive(employee.isActive());
        dto.setDirect(employee.isDirect());
        dto.setActiveForPlanification(employee.isActiveForPlanification());
        return dto;
    }

    @Override
    public ResponseEntity<UploadResponse> uploadFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);

            if (headerRow == null || headerRow.getPhysicalNumberOfCells() != EXPECTED_HEADERS.size()) {
                return ResponseEntity.ok(UploadResponse.builder()
                        .success(false)
                        .message("Invalid file structure: Header must match " + EXPECTED_HEADERS)
                        .build());
            }

            List<String> headers = new ArrayList<>();
            headerRow.forEach(cell -> headers.add(cell.getStringCellValue().trim()));

            if (!headers.equals(EXPECTED_HEADERS)) {
                return ResponseEntity.ok(UploadResponse.builder()
                        .success(false)
                        .message("Invalid file structure: Header must match " + EXPECTED_HEADERS)
                        .build());
            }

            UploadAction action = new UploadAction();
            action.setCreationDate(new Date());
            action.setUserName("Ghassen");
            action.setActionName("IMPORT_EMPLOYEES");
            action.setTargetAction("EMPLOYEE");
            action.setOrgName("LEONI Sousse");
            action.setStatus("failed");

            List<EmployeeDTO> employeeDTOs = new ArrayList<>();
            Map<Double, Station> stationMap = stationRepository.findAll().stream()
                    .collect(Collectors.toMap(Station::getRefSapLeoni, station -> station));
            Map<String, Segment> segmentMap = segmentRepository.findAll().stream()
                    .collect(Collectors.toMap(Segment::getName, segment -> segment));

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                try {
                    EmployeeDTO dto = EmployeeDTO.builder()
                            .serialNumber(row.getCell(0) != null ? (long) row.getCell(0).getNumericCellValue() : 0)
                            .firstName(row.getCell(4) != null ? row.getCell(4).getStringCellValue() : null)
                            .lastName(row.getCell(3) != null ? row.getCell(3).getStringCellValue() : null)
                            .costCenter(row.getCell(5) != null ? (int) row.getCell(5).getNumericCellValue() : 0)
                            .againstMaster(row.getCell(9) != null ? row.getCell(9).getStringCellValue() : null)
                            .groupName(row.getCell(10) != null ? row.getCell(10).getStringCellValue() : null)
                            .direct(row.getCell(11) != null && row.getCell(11).getStringCellValue() != null && row.getCell(11).getStringCellValue().trim().toLowerCase().contains("direct"))
                            .regions(row.getCell(7) != null ? row.getCell(7).getStringCellValue() : null)
                            .segments(row.getCell(8) != null ? row.getCell(8).getStringCellValue() : null)
                            .build();
                    employeeDTOs.add(dto);
                } catch (Exception e) {
                    employeeDTOs.add(EmployeeDTO.builder()
                            .serialNumber(row.getCell(0) != null ? (long) row.getCell(0).getNumericCellValue() : 0)
                            .build());
                }
            }

            List<String> errors = collectErrors(employeeDTOs, stationMap, segmentMap);
            if (!errors.isEmpty()) {
                uploadActionRepository.save(action);
                FileProcessingUtil.saveFileToDisk(file, action.getId(), uploadDir);
                File errorFile = generateErrorXlsx(errors);
                emailSenderService.sendEmailWithAttachment(
                        "savageyt6@gmail.com",
                        "Employee Upload Errors",
                        "Please find attached an XLSX file detailing errors found in the uploaded employee data.",
                        errorFile
                );
                errorFile.delete();
                return ResponseEntity.ok(UploadResponse.builder()
                        .success(false)
                        .message("Errors found in uploaded data. Details sent to savageyt6@gmail.com.")
                        .build());
            }

            saveEmployees(employeeDTOs, stationMap, segmentMap);
            action.setStatus("success");
            uploadActionRepository.save(action);
            FileProcessingUtil.saveFileToDisk(file, action.getId(), uploadDir);
            return ResponseEntity.ok(UploadResponse.builder()
                    .success(true)
                    .message("All employees were successfully created or updated")
                    .build());
        }
    }

    public ResponseEntity<FileVerificationDTO> verifyFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);

            List<String> errors = new ArrayList<>();
            if (headerRow == null || headerRow.getPhysicalNumberOfCells() != EXPECTED_HEADERS.size()) {
                errors.add("Invalid file structure: Header must match " + EXPECTED_HEADERS);
                return ResponseEntity.ok(new FileVerificationDTO("invalid", errors));
            }

            List<String> headers = new ArrayList<>();
            headerRow.forEach(cell -> headers.add(cell.getStringCellValue().trim()));

            if (!headers.equals(EXPECTED_HEADERS)) {
                errors.add("Invalid file structure: Header must match " + EXPECTED_HEADERS);
                return ResponseEntity.ok(new FileVerificationDTO("invalid", errors));
            }

            List<EmployeeDTO> employeeDTOs = new ArrayList<>();
            Map<Double, Station> stationMap = stationRepository.findAll().stream()
                    .collect(Collectors.toMap(Station::getRefSapLeoni, station -> station));
            Map<String, Segment> segmentMap = segmentRepository.findAll().stream()
                    .collect(Collectors.toMap(Segment::getName, segment -> segment));

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                try {
                    EmployeeDTO dto = EmployeeDTO.builder()
                            .serialNumber(row.getCell(0) != null ? (long) row.getCell(0).getNumericCellValue() : 0)
                            .firstName(row.getCell(4) != null ? row.getCell(4).getStringCellValue() : null)
                            .lastName(row.getCell(3) != null ? row.getCell(3).getStringCellValue() : null)
                            .costCenter(row.getCell(5) != null ? (int) row.getCell(5).getNumericCellValue() : 0)
                            .againstMaster(row.getCell(9) != null ? row.getCell(9).getStringCellValue() : null)
                            .groupName(row.getCell(10) != null ? row.getCell(10).getStringCellValue() : null)
                            .direct(row.getCell(11) != null && row.getCell(11).getStringCellValue() != null && row.getCell(11).getStringCellValue().trim().toLowerCase().contains("direct"))
                            .regions(row.getCell(7) != null ? row.getCell(7).getStringCellValue() : null)
                            .segments(row.getCell(8) != null ? row.getCell(8).getStringCellValue() : null)
                            .build();
                    employeeDTOs.add(dto);
                } catch (Exception e) {
                    employeeDTOs.add(EmployeeDTO.builder()
                            .serialNumber(row.getCell(0) != null ? (long) row.getCell(0).getNumericCellValue() : 0)
                            .build());
                }
            }

            errors.addAll(collectErrors(employeeDTOs, stationMap, segmentMap));
            return ResponseEntity.ok(new FileVerificationDTO(errors.isEmpty() ? "valid" : "invalid", errors));
        }
    }

    private File generateErrorXlsx(List<String> errors) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Upload Errors");
            int rowNum = 0;

            Row headerRow = sheet.createRow(rowNum++);
            Cell headerCell = headerRow.createCell(0);
            headerCell.setCellValue("Error Description");

            for (String error : errors) {
                Row row = sheet.createRow(rowNum++);
                Cell cell = row.createCell(0);
                cell.setCellValue(error);
            }

            sheet.autoSizeColumn(0);

            File tempFile = new File(uploadDir + File.separator + "errorsDetails.xlsx");
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                workbook.write(fos);
            }
            return tempFile;
        }
    }

    private List<String> collectErrors(List<EmployeeDTO> employeeDTOs, Map<Double, Station> stationMap, Map<String, Segment> segmentMap) {
        List<String> errors = new ArrayList<>();
        for (EmployeeDTO dto : employeeDTOs) {
            String identifier = dto.getSerialNumber() != 0 ? String.valueOf(dto.getSerialNumber()) : "Unknown";
            if (dto.getSerialNumber() == 0) {
                errors.add("Employee " + identifier + ": Missing/invalid Matricule");
            }
            if (dto.getFirstName() == null || dto.getFirstName().isBlank()) {
                errors.add("Employee " + identifier + ": Missing PRENOM");
            }
            if (dto.getLastName() == null || dto.getLastName().isBlank()) {
                errors.add("Employee " + identifier + ": Missing NOM");
            }
            if (dto.getCostCenter() == 0) {
                errors.add("Employee " + identifier + ": Missing/invalid COST CENTER");
            }
            if (dto.getRegions() == null || dto.getRegions().isBlank()) {
                errors.add("Employee " + identifier + ": Missing REGION");
            }
            if (dto.getSegments() == null || dto.getSegments().isBlank()) {
                errors.add("Employee " + identifier + ": Missing SEGMENT");
            }
            if (dto.getAgainstMaster() == null || dto.getAgainstMaster().isBlank()) {
                errors.add("Employee " + identifier + ": Missing Contremaitre");
            }
            if (dto.getGroupName() == null || dto.getGroupName().isBlank()) {
                errors.add("Employee " + identifier + ": Missing GROUPE");
            }

            if (dto.getRegions() != null && !dto.getRegions().isBlank()) {
                Double refSapLeoni;
                try {
                    String refSapLeoniStr = dto.getRegions().substring(dto.getRegions().lastIndexOf("/") + 1);
                    refSapLeoni = Double.parseDouble(refSapLeoniStr);
                } catch (Exception e) {
                    errors.add("Employee " + identifier + ": Invalid REGION format, expected numeric ref_sap_leoni");
                    refSapLeoni = null;
                }
                if (refSapLeoni != null && !stationMap.containsKey(refSapLeoni)) {
                    errors.add("Employee " + identifier + ": Station not found: " + dto.getRegions());
                }
            }
            if (dto.getSegments() != null && !dto.getSegments().isBlank() && !segmentMap.containsKey(dto.getSegments())) {
                errors.add("Employee " + identifier + ": Segment not found: " + dto.getSegments());
            }
        }
        return errors;
    }

    private void saveEmployees(List<EmployeeDTO> employeeDTOs, Map<Double, Station> stationMap, Map<String, Segment> segmentMap) {
        Map<Long, Employee> existingEmployees = employeeRepository.findAll().stream()
                .peek(employee -> employee.setActiveForPlanification(false))
                .collect(Collectors.toMap(Employee::getSerialNumber, employee -> employee));

        List<Employee> employeesToSave = employeeDTOs.stream()
                .map(dto -> {
                    Double refSapLeoni = null;
                    if (dto.getRegions() != null && !dto.getRegions().isBlank()) {
                        try {
                            refSapLeoni = Double.parseDouble(dto.getRegions().substring(dto.getRegions().lastIndexOf("/") + 1));
                        } catch (NumberFormatException e) {
                            // Invalid ref_sap_leoni, station will remain null
                        }
                    }
                    Station station = refSapLeoni != null ? stationMap.get(refSapLeoni) : null;
                    Segment segment = segmentMap.get(dto.getSegments());
                    Employee employee = existingEmployees.getOrDefault(dto.getSerialNumber(), Employee.builder().build());
                    employee.setSerialNumber(dto.getSerialNumber());
                    employee.setFirstName(dto.getFirstName());
                    employee.setLastName(dto.getLastName());
                    employee.setCostCenter(dto.getCostCenter());
                    employee.setAgainstMaster(dto.getAgainstMaster());
                    employee.setGroupName(dto.getGroupName());
                    employee.setStation(station);
                    employee.setSegment(segment);
                    employee.setActiveForPlanification(true);
                    employee.setActive(true);
                    employee.setDirect(dto.isDirect());
                    return employee;
                })
                .collect(Collectors.toList());

        employeeRepository.saveAll(employeesToSave);
    }

    @Override
    public ResponseEntity<byte[]> exportEmployeesToExcel() {
        List<EmployeeDTO> employees = getAllActive();
        String[] headers = {"Serial Number", "First Name", "Last Name", "Against Master", "Group Name", "Nature", "Plant Section", "Phone Number", "Cost Center", "Station", "Segment"};
        Function<EmployeeDTO, String[]> dataMapper = employee -> {
            String plantSectionName = "N/A";
            String stationRefRegion = "N/A";
            String segmentName = "N/A";
            if (employee.getPlantSectionId() != null) {
                PlantSection plantSection = plantSectionRepository.findById(employee.getPlantSectionId())
                        .orElse(null);
                plantSectionName = plantSection != null ? plantSection.getName() : "N/A";
            }
            if (employee.getStationId() != null) {
                Station station = stationRepository.findById(employee.getStationId())
                        .orElse(null);
                stationRefRegion = station != null ? station.getRefRegion() : "N/A";
            }
            if (employee.getSegmentId() != null) {
                Segment segment = segmentRepository.findById(employee.getSegmentId())
                        .orElse(null);
                segmentName = segment != null ? segment.getName() : "N/A";
            }
            return new String[] {
                    String.valueOf(employee.getSerialNumber()),
                    employee.getFirstName(),
                    employee.getLastName(),
                    employee.getAgainstMaster(),
                    employee.getGroupName(),
                    String.valueOf(employee.isDirect()),
                    plantSectionName,
                    String.valueOf(employee.getPhoneNumber()),
                    String.valueOf(employee.getCostCenter()),
                    stationRefRegion,
                    segmentName
            };
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(employees, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "employees.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}