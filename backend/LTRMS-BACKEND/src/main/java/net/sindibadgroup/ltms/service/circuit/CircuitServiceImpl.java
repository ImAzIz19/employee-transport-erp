package net.sindibadgroup.ltms.service.circuit;

import net.sindibadgroup.ltms.dto.circuit.CircuitDTO;
import net.sindibadgroup.ltms.model.circuit.Circuit;
import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.station.Station;
import net.sindibadgroup.ltms.repository.AgencyRepository;
import net.sindibadgroup.ltms.repository.CircuitRepository;
import net.sindibadgroup.ltms.repository.StationRepository;
import net.sindibadgroup.ltms.service.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class CircuitServiceImpl implements CircuitService {

    @Autowired
    private CircuitRepository circuitRepository;

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private StationRepository stationRepository;

    @Autowired
    private FileService fileService;

    @Override
    @Transactional(readOnly = true)
    public List<CircuitDTO> getAll() {
        List<Circuit> circuits = circuitRepository.findAll();
        return circuits.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CircuitDTO> getAllActive() {
        List<Circuit> circuits = circuitRepository.findByIsActiveTrue();
        return circuits.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CircuitDTO get(Integer id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with ID: " + id));
        return convertToDTO(circuit);
    }

    @Override
    @Transactional
    public CircuitDTO create(CircuitDTO dto) {
        Circuit circuit = new Circuit();
        mapDTOToCircuit(dto, circuit);
        Circuit saved = circuitRepository.save(circuit);
        return convertToDTO(saved);
    }

    @Override
    @Transactional
    public CircuitDTO modify(Integer id, CircuitDTO dto) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with ID: " + id));
        mapDTOToCircuit(dto, circuit);
        Circuit updated = circuitRepository.save(circuit);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public CircuitDTO activate(Integer id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with ID: " + id));
        circuit.setActive(true);
        Circuit updated = circuitRepository.save(circuit);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public CircuitDTO deactivate(Integer id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with ID: " + id));
        circuit.setActive(false);
        Circuit updated = circuitRepository.save(circuit);
        return convertToDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        Circuit circuit = circuitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Circuit not found with ID: " + id));
        if (circuit.isActive()) {
            throw new RuntimeException("Cannot delete active Circuit. Deactivate first.");
        }
        circuitRepository.delete(circuit);
    }

    private void mapDTOToCircuit(CircuitDTO dto, Circuit circuit) {
        if (dto.getAgencyId() != null) {
            Agency agency = agencyRepository.findById(dto.getAgencyId().longValue())
                    .orElseThrow(() -> new RuntimeException("Agency not found with ID: " + dto.getAgencyId()));
            circuit.setAgency(agency);
        } else if (circuit.getId() == null) {
            throw new RuntimeException("Agency ID is required for new circuits");
        }

        circuit.setPathReference(dto.getPathReference());
        circuit.setLeoniSapReference(dto.getLeoniSapReference());
        circuit.setNumberOfKilometres(dto.getNumberOfKilometres());
        circuit.setEmployeeContribution(dto.getEmployeeContribution());
        circuit.setKilometreCost(dto.getKilometreCost());
        circuit.setArrivalPoint(dto.getArrivalPoint());

        Set<Integer> dtoStationIds = dto.getStations() != null ? dto.getStations() : Set.of();

        List<Station> currentStations = stationRepository.findByCircuit(circuit);

        for (Station station : currentStations) {
            if (!dtoStationIds.contains(station.getId())) {
                station.setCircuit(null);
                stationRepository.save(station);
            }
        }

        if (!dtoStationIds.isEmpty()) {
            List<Station> stationsToUpdate = stationRepository.findAllById(dtoStationIds);
            for (Station station : stationsToUpdate) {
                if (station != null) {
                    station.setCircuit(circuit);
                    stationRepository.save(station);
                }
            }
        }
    }

    private CircuitDTO convertToDTO(Circuit circuit) {
        CircuitDTO dto = new CircuitDTO();
        dto.setId(circuit.getId());
        dto.setPathReference(circuit.getPathReference());
        dto.setLeoniSapReference(circuit.getLeoniSapReference());
        dto.setNumberOfKilometres(circuit.getNumberOfKilometres());
        dto.setEmployeeContribution(circuit.getEmployeeContribution());
        dto.setKilometreCost(circuit.getKilometreCost());
        dto.setArrivalPoint(circuit.getArrivalPoint());
        dto.setAgencyId(circuit.getAgency() != null ? circuit.getAgency().getId().intValue() : null);
        dto.setActive(circuit.isActive());

        Set<Integer> stationIds = stationRepository.findStationIdsByCircuitId(circuit.getId())
                .stream()
                .collect(Collectors.toSet());
        dto.setStations(stationIds);

        return dto;
    }

    @Override
    public ResponseEntity<byte[]> exportCircuitsToExcel() {
        List<CircuitDTO> circuits = getAllActive();
        String[] headers = {"Path Reference", "Leoni SAP Reference", "Number of Kilometres", "Employee Contribution", "Kilometre Cost", "Arrival Point", "Agence"};
        Function<CircuitDTO, String[]> dataMapper = circuit -> {
            String agencyName = "N/A";
            if (circuit.getAgencyId() != null) {
                Agency agency = agencyRepository.findById(circuit.getAgencyId().longValue())
                        .orElse(null);
                agencyName = agency != null ? agency.getName() : "N/A";
            }
            return new String[] {
                    circuit.getPathReference(),
                    circuit.getLeoniSapReference(),
                    String.valueOf(circuit.getNumberOfKilometres()),
                    String.valueOf(circuit.getEmployeeContribution()),
                    String.valueOf(circuit.getKilometreCost()),
                    circuit.getArrivalPoint(),
                    agencyName
            };
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(circuits, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "circuits.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}