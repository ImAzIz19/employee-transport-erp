package net.sindibadgroup.ltms.service.bill;

import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.planification.BusPlan;
import net.sindibadgroup.ltms.repository.AgencyRepository;
import net.sindibadgroup.ltms.repository.BusPlanRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BillServiceImpl implements BillService {

    @Autowired
    private BusPlanRepository busPlanRepository;

    @Autowired
    private AgencyRepository agencyRepository;

    @Override
    public byte[] generateBillExcel(Long agencyId, int year, int month) {
        Agency agency = agencyRepository.findById(agencyId)
                .orElseThrow(() -> new RuntimeException("Agency not found"));

        List<String> weeks = getWeeksInMonth(year, month);
        List<BusPlan> busPlans = new ArrayList<>();
        for (String week : weeks) {
            busPlans.addAll(busPlanRepository.findByWeekAndAgencyWithFilters(week, agency, null, null, null));
        }

        // Eagerly process the stream to avoid concurrent modification
        Map<Circuit, Long> circuitCounts = busPlans.stream()
                .filter(bp -> bp.getNumberOfStandardBuses() > 0 || bp.getNumberOfMiniBuses() > 0)
                .collect(Collectors.groupingBy(
                        BusPlan::getCircuit,
                        Collectors.counting()
                ));

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Bill");

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 14);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Add date range rows
            LocalDate startDate = LocalDate.of(year, month, 1);
            LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd");

            Row startDateRow = sheet.createRow(0);
            startDateRow.createCell(0).setCellValue("Date Debut:");
            startDateRow.createCell(1).setCellValue(startDate.format(formatter));

            Row endDateRow = sheet.createRow(1);
            endDateRow.createCell(0).setCellValue("Date Fin:");
            endDateRow.createCell(1).setCellValue(endDate.format(formatter));

            // Add header row
            Row headerRow = sheet.createRow(2);
            String[] headers = {"Circuit", "Nbre Navettes Planifiees", "Cout Par Km", "Nbre de Kilometres", "Sous-Total"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
                sheet.autoSizeColumn(i);
            }

            CellStyle dataStyle = workbook.createCellStyle();
            dataStyle.setAlignment(HorizontalAlignment.CENTER);

            int rowNum = 3; // Start data rows after header
            double totalFacture = 0;
            for (Map.Entry<Circuit, Long> entry : circuitCounts.entrySet()) {
                Circuit circuit = entry.getKey();
                Long count = entry.getValue();
                double costPerKm = circuit.getKilometreCost();
                int numberOfKilometres = circuit.getNumberOfKilometres();
                double subtotal = count * costPerKm * numberOfKilometres * 2;

                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(circuit.getPathReference());
                row.createCell(1).setCellValue(count);
                row.createCell(2).setCellValue(costPerKm);
                row.createCell(3).setCellValue(numberOfKilometres);
                row.createCell(4).setCellValue(subtotal);

                for (int i = 0; i < headers.length; i++) {
                    row.getCell(i).setCellStyle(dataStyle);
                }
                totalFacture += subtotal;
            }

            // Add summary rows
            CellStyle summaryStyle = workbook.createCellStyle();
            summaryStyle.setFillForegroundColor(IndexedColors.LIGHT_YELLOW.getIndex());
            summaryStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            summaryStyle.setAlignment(HorizontalAlignment.CENTER);
            Font summaryFont = workbook.createFont();
            summaryFont.setBold(true);
            summaryStyle.setFont(summaryFont);

            Row totalTripsRow = sheet.createRow(rowNum++);
            for (int i = 0; i < headers.length; i++) {
                totalTripsRow.createCell(i); // Create cells for all columns
            }
            totalTripsRow.getCell(0).setCellValue("Total Nb of Trips");
            totalTripsRow.getCell(1).setCellValue(circuitCounts.values().stream().mapToLong(Long::longValue).sum());
            for (int i = 0; i < headers.length; i++) {
                totalTripsRow.getCell(i).setCellStyle(summaryStyle);
            }

            Row totalFactureRow = sheet.createRow(rowNum++);
            for (int i = 0; i < headers.length; i++) {
                totalFactureRow.createCell(i); // Create cells for all columns
            }
            totalFactureRow.getCell(0).setCellValue("Total Facture:");
            totalFactureRow.getCell(4).setCellValue(totalFacture);
            for (int i = 0; i < headers.length; i++) {
                totalFactureRow.getCell(i).setCellStyle(summaryStyle);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel file", e);
        }
    }

    private List<String> getWeeksInMonth(Integer year, Integer month) {
        List<String> weeks = new ArrayList<>();
        LocalDate date = LocalDate.of(year, month, 1);
        WeekFields weekFields = WeekFields.ISO;
        int daysInMonth = date.lengthOfMonth();

        for (int day = 1; day <= daysInMonth; day++) {
            LocalDate currentDate = LocalDate.of(year, month, day);
            int weekNumber = currentDate.get(weekFields.weekOfYear());
            int weekYear = currentDate.get(weekFields.weekBasedYear());
            String weekString = String.format("KW-%d-%02d", weekYear, weekNumber);
            if (!weeks.contains(weekString)) {
                weeks.add(weekString);
            }
        }
        return weeks;
    }
}