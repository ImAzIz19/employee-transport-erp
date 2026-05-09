package net.sindibadgroup.ltms.service.busPlanification;

import net.sindibadgroup.ltms.dto.planification.BusPlanDTO;
import net.sindibadgroup.ltms.dto.planification.BusPlanRequestDTO;
import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.planification.BusPlan;
import net.sindibadgroup.ltms.repository.AgencyRepository;
import net.sindibadgroup.ltms.repository.BusPlanRepository;
import net.sindibadgroup.ltms.service.email.EmailSenderService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusPlanServiceImpl implements BusPlanService {
    @Autowired
    private BusPlanRepository busPlanRepository;
    @Autowired
    private AgencyRepository agencyRepository;
    @Autowired
    private EmailSenderService emailSenderService;

    private static final List<String> VALID_WEEKDAYS = Arrays.asList(
            "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    );

    private BusPlanDTO convertToDTO(BusPlan busPlan) {
        String[] parts = busPlan.getWeek().split("-");
        int year = Integer.parseInt(parts[1]);
        int weekNumber = Integer.parseInt(parts[2]);
        if (weekNumber < 1 || weekNumber > 53) {
            throw new IllegalArgumentException("Week number must be between 1 and 53");
        }
        LocalDate firstDayOfWeek = LocalDate.of(year, 1, 1)
                .with(WeekFields.ISO.weekBasedYear(), year)
                .with(WeekFields.ISO.weekOfWeekBasedYear(), weekNumber)
                .with(WeekFields.ISO.dayOfWeek(), 1);
        Map<String, String> weekdayToDateMap = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        weekdayToDateMap.put("Monday", firstDayOfWeek.format(formatter));
        weekdayToDateMap.put("Tuesday", firstDayOfWeek.plusDays(1).format(formatter));
        weekdayToDateMap.put("Wednesday", firstDayOfWeek.plusDays(2).format(formatter));
        weekdayToDateMap.put("Thursday", firstDayOfWeek.plusDays(3).format(formatter));
        weekdayToDateMap.put("Friday", firstDayOfWeek.plusDays(4).format(formatter));
        weekdayToDateMap.put("Saturday", firstDayOfWeek.plusDays(5).format(formatter));
        weekdayToDateMap.put("Sunday", firstDayOfWeek.plusDays(6).format(formatter));

        String startTime = "Unknown";
        String endTime = "Unknown";
        if (busPlan.getShift() != null) {
            String rawStartTime = busPlan.getShift().getStartTime();
            String rawEndTime = busPlan.getShift().getEndTime();
            if (rawStartTime != null && rawStartTime.matches("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")) {
                startTime = rawStartTime;
            }
            if (rawEndTime != null && rawEndTime.matches("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$")) {
                endTime = rawEndTime;
            }
        }

        return BusPlanDTO.builder()
                .id(busPlan.getId())
                .agencyName(busPlan.getAgency() != null ? busPlan.getAgency().getName() : "Unknown")
                .circuitName(busPlan.getCircuit() != null ? busPlan.getCircuit().getPathReference() : "Unknown")
                .weekDay(busPlan.getWeekday())
                .date(weekdayToDateMap.get(busPlan.getWeekday()))
                .startTime(startTime)
                .endTime(endTime)
                .numberOfEmployees(busPlan.getEmployeeNumber())
                .numberOfStandardBuses(busPlan.getNumberOfStandardBuses())
                .numberOfMiniBuses(busPlan.getNumberOfMiniBuses())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusPlanDTO> getAllByWeek(BusPlanRequestDTO requestDTO) {
        if (requestDTO.getWeek() == null || !requestDTO.getWeek().matches("KW-\\d{4}-\\d{1,2}")) {
            throw new IllegalArgumentException("Invalid week format. Expected format: KW-YYYY-WW (e.g., KW-2025-17)");
        }
        List<String> weekdays = requestDTO.getWeekdays() != null
                ? requestDTO.getWeekdays().stream()
                .filter(VALID_WEEKDAYS::contains)
                .collect(Collectors.toList())
                : null;
        if (weekdays != null && weekdays.isEmpty()) {
            weekdays = null;
        }
        List<Integer> shiftIds = requestDTO.getShiftsIds() != null && !requestDTO.getShiftsIds().isEmpty()
                ? requestDTO.getShiftsIds()
                : null;
        List<Integer> circuitIds = requestDTO.getCircuitIds() != null && !requestDTO.getCircuitIds().isEmpty()
                ? requestDTO.getCircuitIds()
                : null;
        List<BusPlan> busPlans = (weekdays == null && shiftIds == null && circuitIds == null)
                ? busPlanRepository.findByWeek(requestDTO.getWeek())
                : busPlanRepository.findByWeekWithFilters(
                requestDTO.getWeek(),
                weekdays,
                shiftIds,
                circuitIds
        );
        return busPlans.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<BusPlanDTO> getByAgency(BusPlanRequestDTO requestDTO) {
        if (requestDTO.getWeek() == null || !requestDTO.getWeek().matches("KW-\\d{4}-\\d{1,2}")) {
            throw new IllegalArgumentException("Invalid week format. Expected format: KW-YYYY-WW (e.g., KW-2025-17)");
        }
        if (requestDTO.getAgencyId() == null) {
            throw new IllegalArgumentException("Agency ID is required");
        }
        Agency agency = agencyRepository.findById(requestDTO.getAgencyId())
                .orElseThrow(() -> new IllegalArgumentException("Agency not found with ID: " + requestDTO.getAgencyId()));
        List<String> weekdays = requestDTO.getWeekdays() != null
                ? requestDTO.getWeekdays().stream()
                .filter(VALID_WEEKDAYS::contains)
                .collect(Collectors.toList())
                : null;
        if (weekdays != null && weekdays.isEmpty()) {
            weekdays = null;
        }
        List<Integer> shiftIds = requestDTO.getShiftsIds() != null && !requestDTO.getShiftsIds().isEmpty()
                ? requestDTO.getShiftsIds()
                : null;
        List<Integer> circuitIds = requestDTO.getCircuitIds() != null && !requestDTO.getCircuitIds().isEmpty()
                ? requestDTO.getCircuitIds()
                : null;
        List<BusPlan> busPlans = (weekdays == null && shiftIds == null && circuitIds == null)
                ? busPlanRepository.findByWeekAndAgency(requestDTO.getWeek(), agency)
                : busPlanRepository.findByWeekAndAgencyWithFilters(
                requestDTO.getWeek(),
                agency,
                weekdays,
                shiftIds,
                circuitIds
        );
        return busPlans.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BusPlanDTO modifyBusPlan(BusPlanRequestDTO requestDTO) {
        if (requestDTO.getBusPlanId() == null) {
            throw new IllegalArgumentException("Bus Plan ID is required");
        }
        if (requestDTO.getNumberOfStandardBuses() == null) {
            throw new IllegalArgumentException("Number of standard buses is required");
        }
        if (requestDTO.getNumberOfMiniBuses() == null) {
            throw new IllegalArgumentException("Number of mini buses is required");
        }
        if (requestDTO.getNumberOfStandardBuses() < 0 || requestDTO.getNumberOfMiniBuses() < 0) {
            throw new IllegalArgumentException("Number of buses cannot be negative");
        }
        BusPlan busPlan = busPlanRepository.findById(requestDTO.getBusPlanId())
                .orElseThrow(() -> new IllegalArgumentException("Bus Plan not found with ID: " + requestDTO.getBusPlanId()));
        busPlan.setNumberOfStandardBuses(requestDTO.getNumberOfStandardBuses());
        busPlan.setNumberOfMiniBuses(requestDTO.getNumberOfMiniBuses());
        busPlanRepository.save(busPlan);
        return convertToDTO(busPlan);
    }

    @Override
    @Transactional(readOnly = true)
    public void exportBusPlansToExcel(Long agencyId, String week) {
        // Validate inputs
        if (agencyId == null) {
            throw new IllegalArgumentException("Agency ID is required");
        }
        if (week == null || !week.matches("KW-\\d{4}-\\d{1,2}")) {
            throw new IllegalArgumentException("Invalid week format. Expected: KW-YYYY-WW (e.g., KW-2025-17)");
        }

        // Fetch agency and bus plans
        Agency agency = agencyRepository.findById(agencyId)
                .orElseThrow(() -> new IllegalArgumentException("Agency not found with ID: " + agencyId));
        List<BusPlan> busPlans = busPlanRepository.findByWeekAndAgency(week, agency);

        // Filter bus plans where at least one bus type > 0
        List<BusPlan> filteredBusPlans = busPlans.stream()
                .filter(bp -> bp.getNumberOfStandardBuses() > 0 || bp.getNumberOfMiniBuses() > 0)
                .collect(Collectors.toList());
        List<BusPlanDTO> busPlanDTOs = filteredBusPlans.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        // Calculate total number of buses
        int totalStandardBuses = busPlanDTOs.stream().mapToInt(BusPlanDTO::getNumberOfStandardBuses).sum();
        int totalMiniBuses = busPlanDTOs.stream().mapToInt(BusPlanDTO::getNumberOfMiniBuses).sum();
        int totalBuses = totalStandardBuses + totalMiniBuses;

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Bus Plans");

            // Weekday mappings (English to French)
            Map<String, String> englishToFrenchWeekdays = new HashMap<>();
            englishToFrenchWeekdays.put("Saturday", "Samedi");
            englishToFrenchWeekdays.put("Sunday", "Dimanche");
            englishToFrenchWeekdays.put("Monday", "Lundi");
            englishToFrenchWeekdays.put("Tuesday", "Mardi");
            englishToFrenchWeekdays.put("Wednesday", "Mercredi");
            englishToFrenchWeekdays.put("Thursday", "Jeudi");
            englishToFrenchWeekdays.put("Friday", "Vendredi");

            // Header rows
            Row row0 = sheet.createRow(0);
            row0.createCell(0).setCellValue("Semaine");
            row0.createCell(1).setCellValue(week);

            Row row1 = sheet.createRow(1);
            row1.createCell(0).setCellValue("Agence:");
            row1.createCell(1).setCellValue(agency.getName());

            Row row2 = sheet.createRow(2);
            row2.createCell(0).setCellValue("Nbre Par bus:");
            row2.createCell(1).setCellValue(totalBuses);

            // Table headers
            Row headerRow = sheet.createRow(4);
            String[] headers = {"Circuit", "Jour", "Date du Jour", "Poste", "Nbre Employes", "Nbre Bus Std.", "Nbre Mini Bus"};
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            // Table data
            int rowNum = 5;
            for (BusPlanDTO dto : busPlanDTOs) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(dto.getCircuitName());
                row.createCell(1).setCellValue(englishToFrenchWeekdays.get(dto.getWeekDay()));
                row.createCell(2).setCellValue(dto.getDate());
                String poste = (dto.getStartTime().equals("Unknown") || dto.getEndTime().equals("Unknown"))
                        ? "Unknown"
                        : dto.getStartTime() + "-" + dto.getEndTime();
                row.createCell(3).setCellValue(poste);
                row.createCell(4).setCellValue(dto.getNumberOfEmployees());
                row.createCell(5).setCellValue(dto.getNumberOfStandardBuses());
                row.createCell(6).setCellValue(dto.getNumberOfMiniBuses());
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Generate Excel file
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            byte[] excelBytes = out.toByteArray();

            // Send email with Excel attachment
            try {
                String subject = "Bus Plan Export for Week " + week;
                String body = "Dear " + agency.getName() + ",\n\nAttached is the bus plan export for week " + week + ".\n\nBest regards,\nLTMS Team";
                File tempFile = File.createTempFile("bus_plans_" + week, ".xlsx");
                try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                    fos.write(excelBytes);
                }
                emailSenderService.sendEmailWithAttachment(agency.getEmail(), subject, body, tempFile);
                tempFile.delete(); // Clean up temporary file
            } catch (Exception e) {
                throw new IllegalStateException("Failed to send email with Excel attachment: " + e.getMessage());
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Failed to generate Excel file: " + e.getMessage());
        }
    }
}