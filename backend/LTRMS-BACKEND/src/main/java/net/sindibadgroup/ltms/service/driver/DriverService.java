package net.sindibadgroup.ltms.service.driver;

import net.sindibadgroup.ltms.dto.driver.DriverDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface DriverService {
    DriverDTO createChauffeur(DriverDTO driverDTO);
    Optional<DriverDTO> getChauffeurById(Long id);
    List<DriverDTO> getAllChauffeurs();
    List<DriverDTO> getAllActiveDrivers();
    DriverDTO updateChauffeur(Long id, DriverDTO driverDTO);
    void deleteChauffeur(Long id);
    DriverDTO activateDriver(Long id);
    DriverDTO deactivateDriver(Long id);
    ResponseEntity<byte[]> exportChauffeursToExcel();
}