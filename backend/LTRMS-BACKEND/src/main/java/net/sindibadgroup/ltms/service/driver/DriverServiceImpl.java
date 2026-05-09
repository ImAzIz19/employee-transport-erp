package net.sindibadgroup.ltms.service.driver;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import net.sindibadgroup.ltms.dto.driver.DriverDTO;
import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.driver.Driver;
import net.sindibadgroup.ltms.repository.AgencyRepository;
import net.sindibadgroup.ltms.repository.DriverRepository;
import net.sindibadgroup.ltms.service.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class DriverServiceImpl implements DriverService {

    @Autowired
    private DriverRepository driverRepository;

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private FileService fileService;

    @Override
    public DriverDTO createChauffeur(DriverDTO driverDTO) {
        Agency agency = agencyRepository.findById(driverDTO.getAgenceId())
                .orElseThrow(() -> new RuntimeException("Agency not found with id: " + driverDTO.getAgenceId()));
        Driver driver = new Driver();
        driver.setPrenom(driverDTO.getPrenom());
        driver.setNom(driverDTO.getNom());
        driver.setDateDeNaissance(driverDTO.getDateDeNaissance());
        driver.setTelephone(driverDTO.getTelephone());
        driver.setAgency(agency);
        Driver savedDriver = driverRepository.save(driver);
        return new DriverDTO(savedDriver.getId(), savedDriver.getPrenom(), savedDriver.getNom(),
                savedDriver.getDateDeNaissance(), savedDriver.getTelephone(), savedDriver.isActive(),
                savedDriver.getAgency().getId(), new AgencyDTO(savedDriver.getAgency().getId(),
                savedDriver.getAgency().getName(), savedDriver.getAgency().getAddress(),
                savedDriver.getAgency().getNomDeEntreprise(), savedDriver.getAgency().getEmail(),
                savedDriver.getAgency().getNumeroDeTelephone(), savedDriver.getAgency().getMatricule(),
                savedDriver.getAgency().getHoraireDeTravail(), savedDriver.getAgency().getSiteInternet(),
                savedDriver.getAgency().isActive(), savedDriver.getAgency().getVehicules().size(),
                savedDriver.getAgency().getDrivers().size()));
    }

    @Override
    public Optional<DriverDTO> getChauffeurById(Long id) {
        return driverRepository.findById(id).map(driver -> new DriverDTO(driver.getId(), driver.getPrenom(),
                driver.getNom(), driver.getDateDeNaissance(), driver.getTelephone(), driver.isActive(),
                driver.getAgency().getId(), new AgencyDTO(driver.getAgency().getId(),
                driver.getAgency().getName(), driver.getAgency().getAddress(),
                driver.getAgency().getNomDeEntreprise(), driver.getAgency().getEmail(),
                driver.getAgency().getNumeroDeTelephone(), driver.getAgency().getMatricule(),
                driver.getAgency().getHoraireDeTravail(), driver.getAgency().getSiteInternet(),
                driver.getAgency().isActive(), driver.getAgency().getVehicules().size(),
                driver.getAgency().getDrivers().size())));
    }

    @Override
    public List<DriverDTO> getAllChauffeurs() {
        return driverRepository.findAll().stream().map(driver -> new DriverDTO(driver.getId(), driver.getPrenom(),
                driver.getNom(), driver.getDateDeNaissance(), driver.getTelephone(), driver.isActive(),
                driver.getAgency().getId(), new AgencyDTO(driver.getAgency().getId(),
                driver.getAgency().getName(), driver.getAgency().getAddress(),
                driver.getAgency().getNomDeEntreprise(), driver.getAgency().getEmail(),
                driver.getAgency().getNumeroDeTelephone(), driver.getAgency().getMatricule(),
                driver.getAgency().getHoraireDeTravail(), driver.getAgency().getSiteInternet(),
                driver.getAgency().isActive(), driver.getAgency().getVehicules().size(),
                driver.getAgency().getDrivers().size()))).collect(Collectors.toList());
    }

    @Override
    public List<DriverDTO> getAllActiveDrivers() {
        return driverRepository.findByIsActiveTrue().stream().map(driver -> new DriverDTO(driver.getId(),
                driver.getPrenom(), driver.getNom(), driver.getDateDeNaissance(), driver.getTelephone(),
                driver.isActive(), driver.getAgency().getId(), new AgencyDTO(driver.getAgency().getId(),
                driver.getAgency().getName(), driver.getAgency().getAddress(),
                driver.getAgency().getNomDeEntreprise(), driver.getAgency().getEmail(),
                driver.getAgency().getNumeroDeTelephone(), driver.getAgency().getMatricule(),
                driver.getAgency().getHoraireDeTravail(), driver.getAgency().getSiteInternet(),
                driver.getAgency().isActive(), driver.getAgency().getVehicules().size(),
                driver.getAgency().getDrivers().size()))).collect(Collectors.toList());
    }

    @Override
    public DriverDTO updateChauffeur(Long id, DriverDTO driverDTO) {
        Driver driver = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        Agency agency = agencyRepository.findById(driverDTO.getAgenceId())
                .orElseThrow(() -> new RuntimeException("Agency not found with id: " + driverDTO.getAgenceId()));
        driver.setPrenom(driverDTO.getPrenom());
        driver.setNom(driverDTO.getNom());
        driver.setDateDeNaissance(driverDTO.getDateDeNaissance());
        driver.setTelephone(driverDTO.getTelephone());

        driver.setAgency(agency);
        Driver updatedDriver = driverRepository.save(driver);
        return new DriverDTO(updatedDriver.getId(), updatedDriver.getPrenom(), updatedDriver.getNom(),
                updatedDriver.getDateDeNaissance(), updatedDriver.getTelephone(), updatedDriver.isActive(),
                updatedDriver.getAgency().getId(), new AgencyDTO(updatedDriver.getAgency().getId(),
                updatedDriver.getAgency().getName(), updatedDriver.getAgency().getAddress(),
                updatedDriver.getAgency().getNomDeEntreprise(), updatedDriver.getAgency().getEmail(),
                updatedDriver.getAgency().getNumeroDeTelephone(), updatedDriver.getAgency().getMatricule(),
                updatedDriver.getAgency().getHoraireDeTravail(), updatedDriver.getAgency().getSiteInternet(),
                updatedDriver.getAgency().isActive(), updatedDriver.getAgency().getVehicules().size(),
                updatedDriver.getAgency().getDrivers().size()));
    }

    @Override
    public void deleteChauffeur(Long id) {
        driverRepository.deleteById(id);
    }

    @Override
    public DriverDTO activateDriver(Long id) {
        Driver driver = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        driver.setActive(true);
        Driver updatedDriver = driverRepository.save(driver);
        return new DriverDTO(updatedDriver.getId(), updatedDriver.getPrenom(), updatedDriver.getNom(),
                updatedDriver.getDateDeNaissance(), updatedDriver.getTelephone(), updatedDriver.isActive(),
                updatedDriver.getAgency().getId(), new AgencyDTO(updatedDriver.getAgency().getId(),
                updatedDriver.getAgency().getName(), updatedDriver.getAgency().getAddress(),
                updatedDriver.getAgency().getNomDeEntreprise(), updatedDriver.getAgency().getEmail(),
                updatedDriver.getAgency().getNumeroDeTelephone(), updatedDriver.getAgency().getMatricule(),
                updatedDriver.getAgency().getHoraireDeTravail(), updatedDriver.getAgency().getSiteInternet(),
                updatedDriver.getAgency().isActive(), updatedDriver.getAgency().getVehicules().size(),
                updatedDriver.getAgency().getDrivers().size()));
    }

    @Override
    public DriverDTO deactivateDriver(Long id) {
        Driver driver = driverRepository.findById(id).orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
        driver.setActive(false);
        Driver updatedDriver = driverRepository.save(driver);
        return new DriverDTO(updatedDriver.getId(), updatedDriver.getPrenom(), updatedDriver.getNom(),
                updatedDriver.getDateDeNaissance(), updatedDriver.getTelephone(), updatedDriver.isActive(),
                updatedDriver.getAgency().getId(), new AgencyDTO(updatedDriver.getAgency().getId(),
                updatedDriver.getAgency().getName(), updatedDriver.getAgency().getAddress(),
                updatedDriver.getAgency().getNomDeEntreprise(), updatedDriver.getAgency().getEmail(),
                updatedDriver.getAgency().getNumeroDeTelephone(), updatedDriver.getAgency().getMatricule(),
                updatedDriver.getAgency().getHoraireDeTravail(), updatedDriver.getAgency().getSiteInternet(),
                updatedDriver.getAgency().isActive(), updatedDriver.getAgency().getVehicules().size(),
                updatedDriver.getAgency().getDrivers().size()));
    }

    @Override
    public ResponseEntity<byte[]> exportChauffeursToExcel() {
        List<DriverDTO> drivers = getAllActiveDrivers();
        String[] headers = {"Prenom", "Nom", "Date de Naissance", "Telephone", "Agence"};
        Function<DriverDTO, String[]> dataMapper = driver -> new String[] {
                driver.getPrenom(),
                driver.getNom(),
                driver.getDateDeNaissance(),
                driver.getTelephone(),
                driver.getAgence() != null ? driver.getAgence().getName() : "N/A"
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(drivers, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "drivers.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}