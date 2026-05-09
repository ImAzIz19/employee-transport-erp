package net.sindibadgroup.ltms.util;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

public class FileProcessingUtil {

    public static byte[] exportToExcel(List<?> data, String[] headers) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Data");

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowNum = 1;
            for (Object item : data) {
                Row row = sheet.createRow(rowNum++);

                if (item instanceof java.util.Map) {
                    java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                    int colNum = 0;
                    for (String header : headers) {
                        Cell cell = row.createCell(colNum++);
                        Object value = map.get(header);
                        cell.setCellValue(value != null && !value.equals("aaaa") ? value.toString() : "");
                    }
                }
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public static void saveFileToDisk(MultipartFile file, Integer actionId, String uploadDir) throws IOException {
        Path dirPath = Paths.get(uploadDir);
        try {
            Files.createDirectories(dirPath);
            String fileName = "action_" + actionId + ".xlsx";
            Path filePath = dirPath.resolve(fileName);
            file.transferTo(filePath.toFile());
        } catch (IOException e) {
            throw new IOException("Failed to save file for action " + actionId + ": " + e.getMessage(), e);
        }
    }
}