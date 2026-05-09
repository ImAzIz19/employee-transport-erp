package net.sindibadgroup.ltms.service.file;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import net.sindibadgroup.ltms.util.FileProcessingUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class FileServiceImpl implements FileService {

    @Override
    public ResponseEntity<Resource> downloadTemplate(String templateType) {
        try {
            Resource resource = getFileAsResource(templateType);

            String filename;
            switch (templateType) {
                case "employee":
                    filename = "employee_import.xlsx";
                    break;
                case "station":
                    filename = "station_import.xlsx";
                    break;
                case "planification":
                    filename = "planning_import.xlsx";
                    break;
                case "cotisation":
                    filename = "Employee_contribution_exonoration_import_template.xlsx";
                    break;
                default:
                    throw new IllegalArgumentException("Invalid template type: " + templateType);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);
            headers.add(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate");
            headers.add(HttpHeaders.PRAGMA, "no-cache");
            headers.add(HttpHeaders.EXPIRES, "0");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(resource.contentLength())
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(resource);

        } catch (IOException e) {
            throw new RuntimeException("Error downloading file: " + e.getMessage());
        }
    }

    private Resource getFileAsResource(String templateType) throws IOException {
        String filePathStr;
        switch (templateType) {
            case "employee":
                filePathStr = "src/main/resources/static/ExcelTemplates/employee/employee_import.xlsx";
                break;
            case "station":
                filePathStr = "src/main/resources/static/ExcelTemplates/station/station_import.xlsx";
                break;
            case "planification":
                filePathStr = "src/main/resources/static/ExcelTemplates/planification/planning_import.xlsx";
                break;
            case "cotisation":
                filePathStr = "src/main/resources/static/ExcelTemplates/cotisation/Employee_contribution_exonoration_import_template.xlsx";
                break;
            default:
                throw new IllegalArgumentException("Invalid template type: " + templateType);
        }

        Path filePath = Paths.get(filePathStr);
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            throw new IOException("File not found or not readable: " + filePath);
        }

        return resource;
    }

    public <T> byte[] exportToExcel(List<T> entities, String[] headers, Function<T, String[]> dataMapper) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data");
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }
            for (int i = 0; i < entities.size(); i++) {
                Row row = sheet.createRow(i + 1);
                String[] values = dataMapper.apply(entities.get(i));
                for (int j = 0; j < values.length; j++) {
                    row.createCell(j).setCellValue(values[j] != null ? values[j] : "N/A");
                }
            }
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                workbook.write(out);
                return out.toByteArray();
            }
        }
    }

}