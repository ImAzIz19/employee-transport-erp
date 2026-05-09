package net.sindibadgroup.ltms.util;

import net.sindibadgroup.ltms.repository.ShiftRepository;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public class ExcelProcessingUtil {
    private static final Logger logger = LoggerFactory.getLogger(ExcelProcessingUtil.class);

    public static final List<String> EXPECTED_HEADERS = Arrays.asList(
            "Matricule", "jeton", "Collaborateur", "NOM", "PRENOM", "COST CENTER", "SUBAREA",
            "REGION", "SEGMENT", "Contremaitre", "GROUPE", "NATURE", "Admin SAP"
    );

    public static final List<String> EXPECTED_STATION_HEADERS = Arrays.asList(
            "Ref circuit", "Nom circuit", "Index station", "Nom station", "Cotisation",
            "Longitude", "Latitude", "Rayon"
    );

    public static final List<String> EXPECTED_PLANNING_HEADERS = Arrays.asList(
            "Matricule", "Collaborateur", "Samedi", "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"
    );

    private static final Pattern TIME_PATTERN = Pattern.compile("^\\d{2}:\\d{2}\\s\\d{2}:\\d{2}$");

    public static boolean validateHeaders(Sheet sheet, List<String> expectedHeaders) {
        Row headerRow = sheet.getRow(0);
        if (headerRow == null || headerRow.getPhysicalNumberOfCells() != expectedHeaders.size()) {
            return false;
        }

        List<String> headers = new ArrayList<>();
        headerRow.forEach(cell -> headers.add(cell.getStringCellValue().trim()));
        return headers.equals(expectedHeaders);
    }

    public static boolean isValidDaySchedule(String schedule, ShiftRepository shiftRepository) {
        if (schedule == null || schedule.trim().isEmpty()) {
            logger.debug("Invalid schedule: null or empty");
            return false;
        }
        schedule = schedule.trim();
        if (schedule.equalsIgnoreCase("repos")) {
            return true;
        }

        // Normalize schedule: replace hyphens with spaces, ensure leading zeros
        schedule = schedule.replace("-", " ");
        String[] times = schedule.split("\\s+");
        if (times.length != 2) {
            logger.debug("Invalid schedule format: {} (expected 'HH:mm HH:mm')", schedule);
            return false;
        }

        String startTime = normalizeTime(times[0]);
        String endTime = normalizeTime(times[1]);
        if (!TIME_PATTERN.matcher(startTime + " " + endTime).matches()) {
            logger.debug("Schedule does not match TIME_PATTERN: {} {}", startTime, endTime);
            return false;
        }

        // Check if shift exists in database
        boolean shiftExists = shiftRepository.findByStartTimeAndEndTime(startTime, endTime).isPresent();
        if (!shiftExists) {
            logger.debug("No shift found for startTime: {}, endTime: {}", startTime, endTime);
        }
        return shiftExists;
    }

    private static String normalizeTime(String time) {
        if (time == null) {
            return null;
        }
        // Split hours and minutes
        String[] parts = time.split(":");
        if (parts.length != 2) {
            return time;
        }
        try {
            int hours = Integer.parseInt(parts[0].trim());
            String minutes = parts[1].trim();
            // Ensure two-digit hours
            return String.format("%02d:%s", hours, minutes);
        } catch (NumberFormatException e) {
            logger.debug("Failed to normalize time: {}", time);
            return time;
        }
    }
}