package net.sindibadgroup.ltms.service.agency;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import net.sindibadgroup.ltms.exception.RelatedDataException;
import net.sindibadgroup.ltms.exception.ResourceNotFoundException;
import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.repository.AgencyRepository;
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
public class AgencyServiceImpl implements AgencyService {

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private FileService fileService;

    @Override
    public AgencyDTO createAgence(AgencyDTO agencyDTO) {
        Agency agency = new Agency();
        agency.setName(agencyDTO.getName());
        agency.setAddress(agencyDTO.getAddress());
        agency.setNomDeEntreprise(agencyDTO.getNomDeEntreprise());
        agency.setEmail(agencyDTO.getEmail());
        agency.setNumeroDeTelephone(agencyDTO.getNumeroDeTelephone());
        agency.setMatricule(agencyDTO.getMatricule());
        agency.setHoraireDeTravail(agencyDTO.getHoraireDeTravail());
        agency.setSiteInternet(agencyDTO.getSiteInternet());
        Agency savedAgency = agencyRepository.save(agency);
        return new AgencyDTO(savedAgency.getId(), savedAgency.getName(), savedAgency.getAddress(), savedAgency.getNomDeEntreprise(), savedAgency.getEmail(), savedAgency.getNumeroDeTelephone(), savedAgency.getMatricule(), savedAgency.getHoraireDeTravail(), savedAgency.getSiteInternet(), savedAgency.isActive(), 0, 0);
    }

    @Override
    public Optional<AgencyDTO> getAgenceById(Long id) {
        return agencyRepository.findById(id).map(agence -> new AgencyDTO(agence.getId(), agence.getName(), agence.getAddress(), agence.getNomDeEntreprise(), agence.getEmail(), agence.getNumeroDeTelephone(), agence.getMatricule(), agence.getHoraireDeTravail(), agence.getSiteInternet(), agence.isActive(), agence.getVehicules().size(), agence.getDrivers().size()));
    }

    @Override
    public List<AgencyDTO> getAllAgences() {
        return agencyRepository.findAll().stream().map(agence -> new AgencyDTO(agence.getId(), agence.getName(), agence.getAddress(), agence.getNomDeEntreprise(), agence.getEmail(), agence.getNumeroDeTelephone(), agence.getMatricule(), agence.getHoraireDeTravail(), agence.getSiteInternet(), agence.isActive(), agence.getVehicules().size(), agence.getDrivers().size())).collect(Collectors.toList());
    }

    @Override
    public List<AgencyDTO> getAllActiveAgencies() {
        return agencyRepository.findByIsActiveTrue().stream()
                .map(agence -> new AgencyDTO(agence.getId(), agence.getName(), agence.getAddress(), agence.getNomDeEntreprise(), agence.getEmail(), agence.getNumeroDeTelephone(), agence.getMatricule(), agence.getHoraireDeTravail(), agence.getSiteInternet(), agence.isActive(), agence.getVehicules().size(), agence.getDrivers().size()))
                .collect(Collectors.toList());
    }

    @Override
    public AgencyDTO updateAgence(Long id, AgencyDTO agencyDTO) {
        Agency agency = agencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agency not found with id: " + id));

        agency.setName(agencyDTO.getName());
        agency.setAddress(agencyDTO.getAddress());
        agency.setNomDeEntreprise(agencyDTO.getNomDeEntreprise());
        agency.setEmail(agencyDTO.getEmail());
        agency.setNumeroDeTelephone(agencyDTO.getNumeroDeTelephone());
        agency.setMatricule(agencyDTO.getMatricule());
        agency.setHoraireDeTravail(agencyDTO.getHoraireDeTravail());
        agency.setSiteInternet(agencyDTO.getSiteInternet());

        Agency updatedAgency = agencyRepository.save(agency);

        return new AgencyDTO(
                updatedAgency.getId(),
                updatedAgency.getName(),
                updatedAgency.getAddress(),
                updatedAgency.getNomDeEntreprise(),
                updatedAgency.getEmail(),
                updatedAgency.getNumeroDeTelephone(),
                updatedAgency.getMatricule(),
                updatedAgency.getHoraireDeTravail(),
                updatedAgency.getSiteInternet(),
                updatedAgency.isActive(),
                updatedAgency.getVehicules().size(),
                updatedAgency.getDrivers().size()
        );
    }

    @Override
    public void deleteAgence(Long id) {
        Agency agency = agencyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found with id: " + id));

        if ((agency.getDrivers() != null && !agency.getDrivers().isEmpty()) ||
                (agency.getVehicules() != null && !agency.getVehicules().isEmpty())) {
            throw new RelatedDataException("Impossible to delete the data because it is related to drivers or vehicles.");
        }

        agencyRepository.deleteById(id);
    }

    @Override
    public AgencyDTO activateAgency(Long id) {
        Agency agency = agencyRepository.findById(id).orElseThrow(() -> new RuntimeException("Agency not found with id: " + id));
        agency.setActive(true);
        Agency updatedAgency = agencyRepository.save(agency);
        return new AgencyDTO(updatedAgency.getId(), updatedAgency.getName(), updatedAgency.getAddress(), updatedAgency.getNomDeEntreprise(), updatedAgency.getEmail(), updatedAgency.getNumeroDeTelephone(), updatedAgency.getMatricule(), updatedAgency.getHoraireDeTravail(), updatedAgency.getSiteInternet(), updatedAgency.isActive(), updatedAgency.getVehicules().size(), updatedAgency.getDrivers().size());
    }

    @Override
    public AgencyDTO deactivateAgency(Long id) {
        Agency agency = agencyRepository.findById(id).orElseThrow(() -> new RuntimeException("Agency not found with id: " + id));
        agency.setActive(false);
        Agency updatedAgency = agencyRepository.save(agency);
        return new AgencyDTO(updatedAgency.getId(), updatedAgency.getName(), updatedAgency.getAddress(), updatedAgency.getNomDeEntreprise(), updatedAgency.getEmail(), updatedAgency.getNumeroDeTelephone(), updatedAgency.getMatricule(), updatedAgency.getHoraireDeTravail(), updatedAgency.getSiteInternet(), updatedAgency.isActive(), updatedAgency.getVehicules().size(), updatedAgency.getDrivers().size());
    }

    @Override
    public ResponseEntity<byte[]> exportAgencesToExcel() {
        List<AgencyDTO> agencies = getAllActiveAgencies();
        String[] headers = {"Name", "Address", "Nom de Entreprise", "Email", "Numero de Telephone", "Matricule", "Horaire de Travail", "Site Internet"};
        Function<AgencyDTO, String[]> dataMapper = agency -> new String[] {
                agency.getName(),
                agency.getAddress(),
                agency.getNomDeEntreprise(),
                agency.getEmail(),
                agency.getNumeroDeTelephone(),
                agency.getMatricule(),
                agency.getHoraireDeTravail(),
                agency.getSiteInternet()
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(agencies, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "agencies.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}