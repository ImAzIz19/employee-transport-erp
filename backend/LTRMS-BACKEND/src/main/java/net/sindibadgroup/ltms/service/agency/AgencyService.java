package net.sindibadgroup.ltms.service.agency;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface AgencyService {
    AgencyDTO createAgence(AgencyDTO agencyDTO);
    Optional<AgencyDTO> getAgenceById(Long id);
    List<AgencyDTO> getAllAgences();
    List<AgencyDTO> getAllActiveAgencies();
    AgencyDTO updateAgence(Long id, AgencyDTO agencyDTO);
    void deleteAgence(Long id);
    AgencyDTO activateAgency(Long id);
    AgencyDTO deactivateAgency(Long id);
    ResponseEntity<byte[]> exportAgencesToExcel();
}