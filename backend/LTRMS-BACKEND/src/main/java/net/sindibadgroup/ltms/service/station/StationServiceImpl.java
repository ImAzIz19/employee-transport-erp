package net.sindibadgroup.ltms.service.station;

import net.sindibadgroup.ltms.dto.station.StationDTO;
import net.sindibadgroup.ltms.dto.uploadResponse.FileVerificationDTO;
import net.sindibadgroup.ltms.model.action.UploadAction;
import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.station.Station;
import net.sindibadgroup.ltms.repository.CircuitRepository;
import net.sindibadgroup.ltms.repository.StationRepository;
import net.sindibadgroup.ltms.repository.UploadActionRepository;
import net.sindibadgroup.ltms.service.file.FileService;
import net.sindibadgroup.ltms.util.FileProcessingUtil;
import net.sindibadgroup.ltms.util.ExcelProcessingUtil;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class StationServiceImpl implements StationService {

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private UploadActionRepository uploadActionRepository;

    @Autowired
    private FileService fileService;

    @Value("${file.upload-dir:/Uploads}")
    private String uploadDir;

    @Override
    @Transactional(readOnly = true)
    public List<StationDTO> getAll() {
        return stationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<StationDTO> getAllActive() {
        return stationRepository.findByIsActiveTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public StationDTO get(Integer id) {
        return stationRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Station not found"));
    }

    @Override
    public StationDTO create(StationDTO dto) {
        Station station = new Station();
        mapDTOToStation(dto, station);
        Station saved = stationRepository.save(station);
        return convertToDTO(saved);
    }

    @Override
    public StationDTO modify(Integer id, StationDTO dto) {
        if (dto.getCircuitId() == null) {
            throw new RuntimeException("A circuit is required for a station");
        }
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        station.setRefRegion(dto.getRefRegion());
        station.setRefSapLeoni(dto.getRefSapLeoni());
        station.setLongitude(dto.getLongitude());
        station.setLatitude(dto.getLatitude());
        station.setRadius(dto.getRadius());
        Station updated = stationRepository.save(station);
        return convertToDTO(updated);
    }

    @Override
    public StationDTO activate(Integer id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        station.setActive(true);
        Station updated = stationRepository.save(station);
        return convertToDTO(updated);
    }

    @Override
    public StationDTO deactivate(Integer id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        station.setActive(false);
        Station updated = stationRepository.save(station);
        return convertToDTO(updated);
    }

    @Override
    public void delete(Integer id) {
        Station station = stationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Station not found"));
        if (station.isActive()) {
            throw new RuntimeException("Cannot delete active Station. Deactivate first.");
        }
        stationRepository.delete(station);
    }

    @Override
    public ResponseEntity<FileVerificationDTO> verifyFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            List<String> errors = new ArrayList<>();
            if (!ExcelProcessingUtil.validateHeaders(sheet, ExcelProcessingUtil.EXPECTED_STATION_HEADERS)) {
                errors.add("Invalid file structure: Headers must match " + ExcelProcessingUtil.EXPECTED_STATION_HEADERS);
                return ResponseEntity.ok(new FileVerificationDTO("invalid", errors));
            }

            Map<String, Circuit> circuitMap = circuitRepository.findAll().stream()
                    .collect(Collectors.toMap(Circuit::getLeoniSapReference, circuit -> circuit, (c1, c2) -> c1));
            Map<Double, Station> existingStations = stationRepository.findAll().stream()
                    .collect(Collectors.toMap(Station::getRefSapLeoni, station -> station, (s1, s2) -> s1));

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                int rowNum = row.getRowNum() + 1;
                List<String> rowErrors = new ArrayList<>();

                Integer circuitRef = validateCircuitRef(row.getCell(0), rowNum, rowErrors);
                String circuitName = getStringCellValue(row.getCell(1));
                Double indexStation = validateIndexStation(row.getCell(2), rowNum, rowErrors);
                String nomStation = validateNomStation(row.getCell(3), rowNum, rowErrors);

                if (circuitRef != null && !circuitMap.containsKey(String.valueOf(circuitRef))) {
                    rowErrors.add("Row " + rowNum + ": Circuit not found: " + (circuitName != null ? circuitName : "Unknown"));
                }

                if (rowErrors.isEmpty() && indexStation != null) {
                    getNumericCellValue(row.getCell(5), rowNum, "Longitude", rowErrors);
                    getNumericCellValue(row.getCell(6), rowNum, "Latitude", rowErrors);
                    getNumericCellValue(row.getCell(7), rowNum, "Rayon", rowErrors);
                }

                errors.addAll(rowErrors);
            }

            return ResponseEntity.ok(new FileVerificationDTO(errors.isEmpty() ? "valid" : "invalid", errors));
        }
    }

    @Override
    public ResponseEntity<FileVerificationDTO> uploadFile(MultipartFile file) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);

            List<String> errors = new ArrayList<>();
            if (!ExcelProcessingUtil.validateHeaders(sheet, ExcelProcessingUtil.EXPECTED_STATION_HEADERS)) {
                errors.add("Invalid file structure: Headers must match " + ExcelProcessingUtil.EXPECTED_STATION_HEADERS);
                return ResponseEntity.ok(new FileVerificationDTO("invalid", errors));
            }

            Map<String, Circuit> circuitMap = circuitRepository.findAll().stream()
                    .collect(Collectors.toMap(Circuit::getLeoniSapReference, circuit -> circuit, (c1, c2) -> c1));
            Map<Double, Station> existingStations = stationRepository.findAll().stream()
                    .collect(Collectors.toMap(Station::getRefSapLeoni, station -> station, (s1, s2) -> s1));

            boolean anyValidRows = false;

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue;
                int rowNum = row.getRowNum() + 1;
                List<String> rowErrors = new ArrayList<>();

                Integer circuitRef = validateCircuitRef(row.getCell(0), rowNum, rowErrors);
                String circuitName = getStringCellValue(row.getCell(1));
                Double indexStation = validateIndexStation(row.getCell(2), rowNum, rowErrors);
                String nomStation = validateNomStation(row.getCell(3), rowNum, rowErrors);

                if (circuitRef != null && !circuitMap.containsKey(String.valueOf(circuitRef))) {
                    rowErrors.add("Row " + rowNum + ": Circuit not found: " + (circuitName != null ? circuitName : "Unknown"));
                }

                if (rowErrors.isEmpty() && indexStation != null && circuitRef != null) {
                    Station station = existingStations.getOrDefault(indexStation, new Station());
                    station.setRefRegion(nomStation);
                    station.setRefSapLeoni(indexStation);
                    station.setLongitude(getNumericCellValue(row.getCell(5), rowNum, "Longitude", rowErrors));
                    station.setLatitude(getNumericCellValue(row.getCell(6), rowNum, "Latitude", rowErrors));
                    station.setRadius(getNumericCellValue(row.getCell(7), rowNum, "Rayon", rowErrors));
                    station.setActive(true);

                    Circuit circuit = circuitMap.get(String.valueOf(circuitRef));
                    if (circuit != null) {
                        station.setCircuit(circuit);
                        stationRepository.save(station);
                        anyValidRows = true;
                    } else {
                        rowErrors.add("Row " + rowNum + ": Circuit not found for Ref: " + circuitRef);
                    }
                } else {
                    rowErrors.add("Row " + rowNum + ": Skipping due to missing or invalid circuit reference");
                }

                errors.addAll(rowErrors);
            }

            UploadAction action = createUploadAction(anyValidRows);
            uploadActionRepository.save(action);
            FileProcessingUtil.saveFileToDisk(file, action.getId(), uploadDir);

            return ResponseEntity.ok(new FileVerificationDTO(anyValidRows ? "success" : "failed", errors));
        }
    }

    private Integer validateCircuitRef(Cell cell, int rowNum, List<String> errors) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            errors.add("Row " + rowNum + ": Missing Ref circuit (required)");
            return null;
        }
        try {
            return (int) cell.getNumericCellValue();
        } catch (IllegalStateException e) {
            errors.add("Row " + rowNum + ": Ref circuit must be a number");
            return null;
        }
    }

    private Double validateIndexStation(Cell cell, int rowNum, List<String> errors) {
        if (cell == null) {
            errors.add("Row " + rowNum + ": Missing Index station");
            return null;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        }
        if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                errors.add("Row " + rowNum + ": Index station must be a number");
                return null;
            }
        }
        errors.add("Row " + rowNum + ": Index station must be a number");
        return null;
    }

    private String validateNomStation(Cell cell, int rowNum, List<String> errors) {
        String value = getStringCellValue(cell);
        if (value == null || value.isBlank()) {
            errors.add("Row " + rowNum + ": Missing Nom station");
        }
        return value;
    }

    private String getStringCellValue(Cell cell) {
        return cell != null ? cell.getStringCellValue() : null;
    }

    private UploadAction createUploadAction(boolean success) {
        UploadAction action = new UploadAction();
        action.setCreationDate(new Date());
        action.setUserName("Ghassen");
        action.setActionName("IMPORT_STATIONS");
        action.setTargetAction("STATION");
        action.setOrgName("LEONI Sousse");
        action.setStatus(success ? "success" : "failed");
        return action;
    }

    @Override
    public ResponseEntity<byte[]> downloadTemplate() {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Station Template");
            Row headerRow = sheet.createRow(0);

            for (int i = 0; i < ExcelProcessingUtil.EXPECTED_STATION_HEADERS.size(); i++) {
                headerRow.createCell(i).setCellValue(ExcelProcessingUtil.EXPECTED_STATION_HEADERS.get(i));
            }

            for (int i = 0; i < ExcelProcessingUtil.EXPECTED_STATION_HEADERS.size(); i++) {
                sheet.autoSizeColumn(i);
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            byte[] bytes = baos.toByteArray();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "station_template.xlsx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(bytes);
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate template", e);
        }
    }

    private void mapDTOToStation(StationDTO dto, Station station) {
        station.setRefRegion(dto.getRefRegion());
        station.setRefSapLeoni(dto.getRefSapLeoni());
        station.setLongitude(dto.getLongitude());
        station.setLatitude(dto.getLatitude());
        station.setRadius(dto.getRadius());
        if (dto.getCircuitId() != null) {
            Circuit circuit = circuitRepository.findById(dto.getCircuitId())
                    .orElseThrow(() -> new RuntimeException("Circuit not found: " + dto.getCircuitId()));
            station.setCircuit(circuit);
        }
    }

    private StationDTO convertToDTO(Station station) {
        StationDTO dto = new StationDTO();
        dto.setId(station.getId());
        dto.setRefRegion(station.getRefRegion());
        dto.setRefSapLeoni(station.getRefSapLeoni());
        dto.setLongitude(station.getLongitude());
        dto.setLatitude(station.getLatitude());
        dto.setRadius(station.getRadius());
        dto.setActive(station.isActive());
        dto.setCircuitId(station.getCircuit() != null ? station.getCircuit().getId() : null);
        return dto;
    }

    private double getNumericCellValue(Cell cell, int rowNum, String fieldName, List<String> errors) {
        if (cell == null || cell.getCellType() == CellType.BLANK) {
            errors.add("Row " + rowNum + ": " + fieldName + " must be a number");
            return 0;
        }
        if (cell.getCellType() == CellType.NUMERIC) {
            return cell.getNumericCellValue();
        } else if (cell.getCellType() == CellType.STRING) {
            try {
                return Double.parseDouble(cell.getStringCellValue().trim());
            } catch (NumberFormatException e) {
                errors.add("Row " + rowNum + ": " + fieldName + " must be a valid number");
                return 0;
            }
        } else {
            errors.add("Row " + rowNum + ": " + fieldName + " must be a number");
            return 0;
        }
    }

    @Override
    public ResponseEntity<byte[]> exportStationsToExcel() {
        List<StationDTO> stations = getAllActive();
        String[] headers = {"Ref Region", "Ref SAP Leoni", "Longitude", "Latitude", "Radius", "Circuit"};
        Function<StationDTO, String[]> dataMapper = station -> {
            String circuitPathReference = "N/A";
            if (station.getCircuitId() != null) {
                Circuit circuit = circuitRepository.findById(station.getCircuitId())
                        .orElse(null);
                circuitPathReference = circuit != null ? circuit.getPathReference() : "N/A";
            }
            return new String[] {
                    station.getRefRegion(),
                    String.valueOf(station.getRefSapLeoni()),
                    String.valueOf(station.getLongitude()),
                    String.valueOf(station.getLatitude()),
                    String.valueOf(station.getRadius()),
                    circuitPathReference
            };
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(stations, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "stations.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}