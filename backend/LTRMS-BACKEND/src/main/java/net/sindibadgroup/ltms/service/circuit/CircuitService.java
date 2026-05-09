package net.sindibadgroup.ltms.service.circuit;

import net.sindibadgroup.ltms.dto.circuit.CircuitDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CircuitService {
    List<CircuitDTO> getAll();
    List<CircuitDTO> getAllActive();
    CircuitDTO get(Integer id);
    CircuitDTO create(CircuitDTO dto);
    CircuitDTO modify(Integer id, CircuitDTO dto);
    CircuitDTO activate(Integer id);
    CircuitDTO deactivate(Integer id);
    void delete(Integer id);
    ResponseEntity<byte[]> exportCircuitsToExcel();
}