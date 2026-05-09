package net.sindibadgroup.ltms.service.planification;

import net.sindibadgroup.ltms.dto.agency.AgencyNotifRequestDTO;
import net.sindibadgroup.ltms.dto.planification.ManualPlanificationDTO;
import net.sindibadgroup.ltms.dto.planification.PlanificationDTO;
import net.sindibadgroup.ltms.dto.planification.PlanificationRequestDTO;
import net.sindibadgroup.ltms.model.action.UploadAction;
import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.employee.Employee;
import net.sindibadgroup.ltms.dto.employee.EmployeePlanDTO;
import net.sindibadgroup.ltms.model.employee.EmployeePlans;
import net.sindibadgroup.ltms.model.planification.BusPlan;
import net.sindibadgroup.ltms.model.planification.Planification;
import net.sindibadgroup.ltms.model.plant_section.PlantSection;
import net.sindibadgroup.ltms.model.shift.Shift;
import net.sindibadgroup.ltms.model.station.Station;
import net.sindibadgroup.ltms.model.user.UserEntity;

import net.sindibadgroup.ltms.repository.*;
import net.sindibadgroup.ltms.service.email.EmailSenderService;
import net.sindibadgroup.ltms.util.ExcelProcessingUtil;
import net.sindibadgroup.ltms.util.FileProcessingUtil;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlanificationServiceImpl implements PlanificationService {

    private static final Logger logger = LoggerFactory.getLogger(PlanificationServiceImpl.class);

    @Autowired
    private PlanificationRepository planificationRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private EmployeePlansRepository employeePlansRepository;

    @Autowired
    private UploadActionRepository uploadActionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PlantSectionRepository plantSectionRepository;

    @Autowired
    private ShiftRepository shiftRepository;

    @Autowired
    private BusPlanRepository busPlanRepository;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private AgencyRepository agencyRepository ;

    @Autowired
    private CircuitRepository circuitRepository;

    @Value("${file.upload-dir:/Uploads}")
    private String uploadDir;

    @Override
    @Transactional(readOnly = true)
    public List<?> getAll() {
        return planificationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResponseEntity<?> createPlanificationCum(PlanificationRequestDTO requestDTO) throws IOException {
        if (requestDTO.getWeek() == null || requestDTO.getWeek().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Week is required");
        }
        if (requestDTO.getFile() == null || requestDTO.getFile().isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }
        Integer plantSectionId = requestDTO.getPlantSectionId();
        if (plantSectionId == null || plantSectionId == 0) {
            return ResponseEntity.badRequest().body("Plant section ID is required");
        }
        PlantSection plantSection = plantSectionRepository.findById(plantSectionId)
                .orElseThrow(() -> new RuntimeException("Plant section not found"));

        Optional<Planification> existingPlanificationOpt = planificationRepository.findByWeekAndPlantSection(requestDTO.getWeek(), plantSection);
        boolean planificationExists = existingPlanificationOpt.isPresent();

        try (XSSFWorkbook workbook = new XSSFWorkbook(requestDTO.getFile().getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int totalLines = 0;
            int successSaved = 0;
            int nonExistentEmployees = 0;
            int invalidDays = 0;
            int employeesNotActiveForPlanification = 0;
            boolean anyValidRows = false;

            if (!ExcelProcessingUtil.validateHeaders(sheet, ExcelProcessingUtil.EXPECTED_PLANNING_HEADERS)) {
                return ResponseEntity.badRequest().body("Invalid template");
            }

            Map<Long, Employee> allEmployeeMap = employeeRepository.findAll().stream()
                    .collect(Collectors.toMap(Employee::getSerialNumber, emp -> emp, (e1, e2) -> e1));
            Map<Long, Employee> activeEmployeeMap = employeeRepository.findByIsActiveForPlanificationTrue().stream()
                    .collect(Collectors.toMap(Employee::getSerialNumber, emp -> emp, (e1, e2) -> e1));

            Map<Long, EmployeePlans> existingPlansMap = planificationExists
                    ? employeePlansRepository.findByWeekAndEmployeePlantSection(requestDTO.getWeek(), plantSection)
                    .stream()
                    .collect(Collectors.toMap(plan -> plan.getEmployee().getSerialNumber(), plan -> plan, (e1, e2) -> e1))
                    : Map.of();

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                totalLines++;

                Long matricule = validateMatricule(row.getCell(0));
                if (matricule == null) {
                    continue;
                }
                if (!allEmployeeMap.containsKey(matricule)) {
                    nonExistentEmployees++;
                    continue;
                }
                if (!activeEmployeeMap.containsKey(matricule)) {
                    employeesNotActiveForPlanification++;
                    continue;
                }

                String[] shiftSchedule = new String[7];
                boolean validRow = true;
                for (int i = 2; i <= 8; i++) {
                    String dayValue = getStringCellValue(row.getCell(i));
                    if (dayValue == null || !ExcelProcessingUtil.isValidDaySchedule(dayValue, shiftRepository)) {
                        validRow = false;
                        break;
                    }
                    shiftSchedule[i - 2] = dayValue;
                }

                if (!validRow) {
                    invalidDays++;
                    continue;
                }

                Employee employee = activeEmployeeMap.get(matricule);
                EmployeePlans employeePlans = existingPlansMap.getOrDefault(matricule, EmployeePlans.builder()
                        .employee(employee)
                        .week(requestDTO.getWeek())
                        .month(getMonthFromWeekString(requestDTO.getWeek()))
                        .year(getYearFromWeekString(requestDTO.getWeek()))
                        .build());
                employeePlans.setShift(shiftSchedule);
                employeePlansRepository.save(employeePlans);

                successSaved++;
                anyValidRows = true;
            }

            generateBusPlans(requestDTO.getWeek(), plantSection);

            UserEntity user = requestDTO.getUserId() != null
                    ? userRepository.findById(requestDTO.getUserId()).orElse(null)
                    : null;

            UploadAction action = createUploadAction(anyValidRows, user);
            uploadActionRepository.save(action);
            Planification planification = Planification.builder()
                        .week(requestDTO.getWeek())
                        .plantSection(plantSection)
                        .actionDate(new Date())
                        .userName((user != null) ? user.getFirstName() + " " + user.getLastName() : "DEV")
                        .actionName("PLANNING_UPLOAD_ACTION")
                        .targetAction("Week-Planning")
                        .targetActionVariant("IMPORT WITH CUMULATION")
                        .orgName("LTRMS")
                        .actionId(action.getId())
                        .totalLines(totalLines)
                        .successSaved(successSaved)
                        .nonExistentEmployees(nonExistentEmployees)
                        .invalidDays(invalidDays)
                        .emplyeesNotActifForPlanification(employeesNotActiveForPlanification)
                        .build();
            planificationRepository.save(planification);

            FileProcessingUtil.saveFileToDisk(requestDTO.getFile(), action.getId(), uploadDir);

            return ResponseEntity.ok(buildPlanificationDTO(totalLines, successSaved, nonExistentEmployees, invalidDays, employeesNotActiveForPlanification, planification));
        }
    }

    @Override
    @Transactional
    public ResponseEntity<?> createPlanificationEcras(PlanificationRequestDTO requestDTO) throws IOException {
        if (requestDTO.getWeek() == null || requestDTO.getWeek().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Week is required");
        }
        if (requestDTO.getFile() == null || requestDTO.getFile().isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }
        Integer plantSectionId = requestDTO.getPlantSectionId();
        if (plantSectionId == null || plantSectionId == 0) {
            return ResponseEntity.badRequest().body("Plant section ID is required");
        }
        PlantSection plantSection = plantSectionRepository.findById(plantSectionId)
                .orElseThrow(() -> new RuntimeException("Plant section not found"));

        Optional<Planification> existingPlanificationOpt = planificationRepository.findByWeekAndPlantSection(requestDTO.getWeek(), plantSection);
        boolean planificationExists = existingPlanificationOpt.isPresent();

        if (planificationExists) {
            employeePlansRepository.deleteByWeekAndEmployeePlantSection(requestDTO.getWeek(), plantSection);
        }

        try (XSSFWorkbook workbook = new XSSFWorkbook(requestDTO.getFile().getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int totalLines = 0;
            int successSaved = 0;
            int nonExistentEmployees = 0;
            int invalidDays = 0;
            int employeesNotActiveForPlanification = 0;
            boolean anyValidRows = false;

            if (!ExcelProcessingUtil.validateHeaders(sheet, ExcelProcessingUtil.EXPECTED_PLANNING_HEADERS)) {
                return ResponseEntity.badRequest().body("Invalid template");
            }

            Map<Long, Employee> allEmployeeMap = employeeRepository.findAll().stream()
                    .collect(Collectors.toMap(Employee::getSerialNumber, emp -> emp, (e1, e2) -> e1));
            Map<Long, Employee> activeEmployeeMap = employeeRepository.findByIsActiveForPlanificationTrue().stream()
                    .collect(Collectors.toMap(Employee::getSerialNumber, emp -> emp, (e1, e2) -> e1));

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                totalLines++;

                Long matricule = validateMatricule(row.getCell(0));
                if (matricule == null) {
                    continue;
                }
                if (!allEmployeeMap.containsKey(matricule)) {
                    nonExistentEmployees++;
                    continue;
                }
                if (!activeEmployeeMap.containsKey(matricule)) {
                    employeesNotActiveForPlanification++;
                    continue;
                }

                String[] shiftSchedule = new String[7];
                boolean validRow = true;
                for (int i = 2; i <= 8; i++) {
                    String dayValue = getStringCellValue(row.getCell(i));
                    if (dayValue == null || !ExcelProcessingUtil.isValidDaySchedule(dayValue, shiftRepository)) {
                        validRow = false;
                        break;
                    }
                    shiftSchedule[i - 2] = dayValue;
                }

                if (!validRow) {
                    invalidDays++;
                    continue;
                }

                Employee employee = activeEmployeeMap.get(matricule);
                EmployeePlans employeePlans = EmployeePlans.builder()
                        .employee(employee)
                        .week(requestDTO.getWeek())
                        .shift(shiftSchedule)
                        .month(getMonthFromWeekString(requestDTO.getWeek()))
                        .year(getYearFromWeekString(requestDTO.getWeek()))
                        .build();
                employeePlansRepository.save(employeePlans);

                successSaved++;
                anyValidRows = true;
            }

            generateBusPlans(requestDTO.getWeek(), plantSection);

            UserEntity user = requestDTO.getUserId() != null
                    ? userRepository.findById(requestDTO.getUserId()).orElse(null)
                    : null;

            UploadAction action = createUploadAction(anyValidRows, user);
            uploadActionRepository.save(action);
            Planification planification = Planification.builder()
                        .week(requestDTO.getWeek())
                        .plantSection(plantSection)
                        .actionDate(new Date())
                        .userName((user != null) ? user.getFirstName() + " " + user.getLastName() : "DEV")
                        .actionName("PLANNING_UPLOAD_ACTION")
                        .targetAction("Week-Planning")
                        .targetActionVariant("IMPORT WITH OVERWRITING")
                        .orgName("LTRMS")
                        .actionId(action.getId())
                        .totalLines(totalLines)
                        .successSaved(successSaved)
                        .nonExistentEmployees(nonExistentEmployees)
                        .invalidDays(invalidDays)
                        .emplyeesNotActifForPlanification(employeesNotActiveForPlanification)
                        .build();
            planificationRepository.save(planification);

            FileProcessingUtil.saveFileToDisk(requestDTO.getFile(), action.getId(), uploadDir);

            return ResponseEntity.ok(buildPlanificationDTO(totalLines, successSaved, nonExistentEmployees, invalidDays, employeesNotActiveForPlanification, planification));
        }
    }

    @Transactional(readOnly = true)
    @Override
    public ResponseEntity<?> manualPlanification(ManualPlanificationDTO requestDTO) {
        if (requestDTO.getMatricule() == 0) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "Matricule is required"));
        }

        List<EmployeePlans> employeePlansList = employeePlansRepository.findByCriteria(
                requestDTO.getWeek() != null && !requestDTO.getWeek().trim().isEmpty() ? requestDTO.getWeek().trim() : null,
                requestDTO.getPlantSectionId() != 0 ? requestDTO.getPlantSectionId() : null,
                requestDTO.getMatricule()
        );

        if (employeePlansList.isEmpty()) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "No employee plans found for the given criteria"));
        }

        List<EmployeePlanDTO> result = employeePlansList.stream()
                .map(plan -> EmployeePlanDTO.builder()
                        .matricule(plan.getEmployee().getSerialNumber())
                        .fullName(plan.getEmployee().getFirstName() + " " + plan.getEmployee().getLastName())
                        .week(plan.getWeek())
                        .shifts(plan.getShift())
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @Override
    @Transactional
    public ResponseEntity<?> sendAgencyNotification(AgencyNotifRequestDTO requestDTO) throws IOException {
        if (requestDTO.getAgencyEmail() == null || requestDTO.getAgencyEmail().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Agency email is required");
        }
        if (requestDTO.getWeek() == null || requestDTO.getWeek().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Week is required");
        }
        if (requestDTO.getFile() == null || requestDTO.getFile().isEmpty()) {
            return ResponseEntity.badRequest().body("File is required");
        }

        File tempFile = File.createTempFile("agency_plan_", ".xlsx");
        try {
            requestDTO.getFile().transferTo(tempFile);

            String subject = "Weekly Planification for " + requestDTO.getWeek();
            String body = "Please find attached the planification for week " + requestDTO.getWeek() + ".\n\nBest regards,\nLTRMS Team";

            emailSenderService.sendEmailWithAttachment(
                    requestDTO.getAgencyEmail(),
                    subject,
                    body,
                    tempFile
            );

            return ResponseEntity.ok("Notification sent successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } finally {
            tempFile.delete();
        }
    }

    private Long validateMatricule(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        }
        try {
            return (long) cell.getNumericCellValue();
        } catch (IllegalStateException | NumberFormatException e) {
            return null;
        }
    }

    private String getStringCellValue(Cell cell) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            return null;
        }
        try {
            return cell.getStringCellValue().trim();
        } catch (IllegalStateException e) {
            return null;
        }
    }

    private PlanificationDTO buildPlanificationDTO(int totalLines, int successSaved, int nonExistentEmployees, int invalidDays, int employeesNotActiveForPlanification, Planification planification) {
        return PlanificationDTO.builder()
                .week(planification.getWeek())
                .actionName(planification.getActionName())
                .userName(planification.getUserName())
                .targetAction(planification.getTargetAction())
                .targetActionVariant(planification.getTargetActionVariant())
                .orgName(planification.getOrgName())
                .id(planification.getId())
                .actionId(planification.getActionId())
                .totalLines(totalLines)
                .successSaved(successSaved)
                .nonExistentEmployees(nonExistentEmployees)
                .invalidDays(invalidDays)
                .emplyeesNotActifForPlanification(employeesNotActiveForPlanification)
                .build();
    }

    private UploadAction createUploadAction(boolean success, UserEntity user) {
        UploadAction action = new UploadAction();
        action.setCreationDate(new Date());
        action.setUserName((user != null) ? user.getFirstName() + " " + user.getLastName() : "DEV");
        action.setActionName("PLANNING_UPLOAD_ACTION");
        action.setTargetAction("PLANIFICATION");
        action.setOrgName("LTRMS");
        action.setStatus(success ? "success" : "failed");
        return action;
    }

    private PlanificationDTO convertToDTO(Planification planification) {
        return PlanificationDTO.builder()
                .id(planification.getId())
                .week(planification.getWeek())
                .userName(planification.getUserName())
                .actionName(planification.getActionName())
                .targetAction(planification.getTargetAction())
                .targetActionVariant(planification.getTargetActionVariant())
                .orgName(planification.getOrgName())
                .plantSectionName(planification.getPlantSection() != null ? planification.getPlantSection().getName() : null)
                .segmentName(planification.getSegment() != null ? planification.getSegment().getName() : null)
                .actionId(planification.getActionId())
                .totalLines(planification.getTotalLines())
                .successSaved(planification.getSuccessSaved())
                .nonExistentEmployees(planification.getNonExistentEmployees())
                .invalidDays(planification.getInvalidDays())
                .emplyeesNotActifForPlanification(planification.getEmplyeesNotActifForPlanification())
                .build();
    }

    private void generateBusPlans(String week, PlantSection plantSection) {
        // Delete existing bus plans for the given week and plant section to avoid duplication
        busPlanRepository.deleteByWeekAndPlantSection(week, plantSection);// error here

        // Define weekdays corresponding to shift array indices (Saturday to Friday)
        String[] weekdays = {"Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"};

        // Get all employee plans for the given week and plant section
        List<EmployeePlans> employeePlansList = employeePlansRepository.findByWeekAndEmployeePlantSection(week, plantSection);

        // Group employee plans by Agency, Circuit, Weekday, and Shift
        Map<String, List<EmployeePlans>> groupedPlans = new HashMap<>();
        for (EmployeePlans plan : employeePlansList) {
            Employee employee = plan.getEmployee();
            Station station = employee.getStation();
            if (station == null || station.getCircuit() == null || station.getCircuit().getAgency() == null) {
                continue; // Skip if employee has no valid station, circuit, or agency
            }
            Circuit circuit = station.getCircuit();
            Agency agency = circuit.getAgency();
            String[] shifts = plan.getShift();

            for (int i = 0; i < shifts.length; i++) {
                String shiftValue = shifts[i];
                if (shiftValue == null || shiftValue.equals("repos")) {
                    continue; // Skip rest days
                }
                // Create a unique key for grouping: agencyId-circuitId-weekday-shift
                String key = String.format("%d-%d-%s-%s",
                        agency.getId(),
                        circuit.getId(),
                        weekdays[i],
                        shiftValue);
                groupedPlans.computeIfAbsent(key, k -> new ArrayList<>()).add(plan);
            }
        }

        // Process each group to create a BusPlan
        for (Map.Entry<String, List<EmployeePlans>> entry : groupedPlans.entrySet()) {
            String[] keyParts = entry.getKey().split("-");
            Long agencyId = Long.parseLong(keyParts[0]);
            Integer circuitId = Integer.parseInt(keyParts[1]);
            String weekday = keyParts[2];
            String shiftValue = keyParts[3];

            // Find agency, circuit, and shift
            Agency agency = agencyRepository.findById(agencyId)
                    .orElseThrow(() -> new RuntimeException("Agency not found: " + agencyId));
            Circuit circuit = circuitRepository.findById(circuitId)
                    .orElseThrow(() -> new RuntimeException("Circuit not found: " + circuitId));
            Shift shift = shiftRepository.findByStartTimeAndEndTime(shiftValue.split(" ")[0], shiftValue.split(" ")[1])
                    .orElseThrow(() -> new RuntimeException("Shift not found: " + shiftValue));

            // Count employees
            int employeeNumber = entry.getValue().size();

            // Set bus counts to 0 as requested
            int numberOfStandardBuses = 0;
            int numberOfMiniBuses = 0;

            // Create and save BusPlan
            BusPlan busPlan = BusPlan.builder()
                    .week(week)
                    .weekday(weekday)
                    .plantSection(plantSection)
                    .agency(agency)
                    .circuit(circuit)
                    .shift(shift)
                    .employeeNumber(employeeNumber)
                    .numberOfStandardBuses(numberOfStandardBuses)
                    .numberOfMiniBuses(numberOfMiniBuses)
                    .build();
            busPlanRepository.save(busPlan);
        }
    }
    private int getMonthFromWeekString(String weekString) {

        String[] parts = weekString.split("-");
        int year = Integer.parseInt(parts[1]);
        int weekNumber = Integer.parseInt(parts[2]);


        LocalDate date = LocalDate.of(year, 1, 1)
                .with(WeekFields.ISO.weekOfWeekBasedYear(), weekNumber)
                .with(WeekFields.ISO.dayOfWeek(), 1);


        return date.getMonthValue();
    }

    public static int getYearFromWeekString(String weekString) {

        String[] parts = weekString.split("-");
        return Integer.parseInt(parts[1]);
    }
}