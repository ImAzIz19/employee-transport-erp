package net.sindibadgroup.ltms.service.vehicule;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import net.sindibadgroup.ltms.dto.vehicle.VehiculeDTO;
import net.sindibadgroup.ltms.model.agency.Agency;
import net.sindibadgroup.ltms.model.vehicle.Vehicule;
import net.sindibadgroup.ltms.repository.AgencyRepository;
import net.sindibadgroup.ltms.repository.VehiculeRepository;
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
public class VehiculeServiceImpl implements VehiculeService {

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private AgencyRepository agencyRepository;

    @Autowired
    private FileService fileService;

    @Override
    public VehiculeDTO createVehicule(VehiculeDTO vehiculeDTO) {
        Agency agency = agencyRepository.findById(vehiculeDTO.getAgenceId())
                .orElseThrow(() -> new RuntimeException("Agency not found with id: " + vehiculeDTO.getAgenceId()));
        Vehicule vehicule = new Vehicule();
        vehicule.setTypeDeVehicule(vehiculeDTO.getTypeDeVehicule());
        vehicule.setNumDeSeries(vehiculeDTO.getNumDeSeries());
        vehicule.setDateDeMiseEnRoute(vehiculeDTO.getDateDeMiseEnRoute());
        vehicule.setNumDeReference(vehiculeDTO.getNumDeReference());
        vehicule.setCapacite(vehiculeDTO.getCapacite());
        vehicule.setAgency(agency);
        Vehicule savedVehicule = vehiculeRepository.save(vehicule);
        return new VehiculeDTO(savedVehicule.getId(), savedVehicule.getTypeDeVehicule(), savedVehicule.getNumDeSeries(),
                savedVehicule.getDateDeMiseEnRoute(), savedVehicule.getNumDeReference(), savedVehicule.getCapacite(),
                savedVehicule.isActive(), savedVehicule.getAgency().getId(), new AgencyDTO(savedVehicule.getAgency().getId(),
                savedVehicule.getAgency().getName(), savedVehicule.getAgency().getAddress(),
                savedVehicule.getAgency().getNomDeEntreprise(), savedVehicule.getAgency().getEmail(),
                savedVehicule.getAgency().getNumeroDeTelephone(), savedVehicule.getAgency().getMatricule(),
                savedVehicule.getAgency().getHoraireDeTravail(), savedVehicule.getAgency().getSiteInternet(),
                savedVehicule.getAgency().isActive(), savedVehicule.getAgency().getVehicules().size(),
                savedVehicule.getAgency().getDrivers().size()));
    }

    @Override
    public Optional<VehiculeDTO> getVehiculeById(Long id) {
        return vehiculeRepository.findById(id).map(vehicule -> new VehiculeDTO(vehicule.getId(), vehicule.getTypeDeVehicule(),
                vehicule.getNumDeSeries(), vehicule.getDateDeMiseEnRoute(), vehicule.getNumDeReference(), vehicule.getCapacite(),
                vehicule.isActive(), vehicule.getAgency().getId(), new AgencyDTO(vehicule.getAgency().getId(),
                vehicule.getAgency().getName(), vehicule.getAgency().getAddress(),
                vehicule.getAgency().getNomDeEntreprise(), vehicule.getAgency().getEmail(),
                vehicule.getAgency().getNumeroDeTelephone(), vehicule.getAgency().getMatricule(),
                vehicule.getAgency().getHoraireDeTravail(), vehicule.getAgency().getSiteInternet(),
                vehicule.getAgency().isActive(), vehicule.getAgency().getVehicules().size(),
                vehicule.getAgency().getDrivers().size())));
    }

    @Override
    public List<VehiculeDTO> getAllVehicules() {
        return vehiculeRepository.findAll().stream().map(vehicule -> new VehiculeDTO(vehicule.getId(), vehicule.getTypeDeVehicule(),
                vehicule.getNumDeSeries(), vehicule.getDateDeMiseEnRoute(), vehicule.getNumDeReference(), vehicule.getCapacite(),
                vehicule.isActive(), vehicule.getAgency().getId(), new AgencyDTO(vehicule.getAgency().getId(),
                vehicule.getAgency().getName(), vehicule.getAgency().getAddress(),
                vehicule.getAgency().getNomDeEntreprise(), vehicule.getAgency().getEmail(),
                vehicule.getAgency().getNumeroDeTelephone(), vehicule.getAgency().getMatricule(),
                vehicule.getAgency().getHoraireDeTravail(), vehicule.getAgency().getSiteInternet(),
                vehicule.getAgency().isActive(), vehicule.getAgency().getVehicules().size(),
                vehicule.getAgency().getDrivers().size()))).collect(Collectors.toList());
    }

    @Override
    public List<VehiculeDTO> getAllActiveVehicules() {
        return vehiculeRepository.findByIsActiveTrue().stream().map(vehicule -> new VehiculeDTO(vehicule.getId(),
                vehicule.getTypeDeVehicule(), vehicule.getNumDeSeries(), vehicule.getDateDeMiseEnRoute(),
                vehicule.getNumDeReference(), vehicule.getCapacite(), vehicule.isActive(), vehicule.getAgency().getId(),
                new AgencyDTO(vehicule.getAgency().getId(), vehicule.getAgency().getName(), vehicule.getAgency().getAddress(),
                        vehicule.getAgency().getNomDeEntreprise(), vehicule.getAgency().getEmail(),
                        vehicule.getAgency().getNumeroDeTelephone(), vehicule.getAgency().getMatricule(),
                        vehicule.getAgency().getHoraireDeTravail(), vehicule.getAgency().getSiteInternet(),
                        vehicule.getAgency().isActive(), vehicule.getAgency().getVehicules().size(),
                        vehicule.getAgency().getDrivers().size()))).collect(Collectors.toList());
    }

    @Override
    public VehiculeDTO updateVehicule(Long id, VehiculeDTO vehiculeDTO) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found with id: " + id));
        Agency agency = agencyRepository.findById(vehiculeDTO.getAgenceId())
                .orElseThrow(() -> new RuntimeException("Agency not found with id: " + vehiculeDTO.getAgenceId()));
        vehicule.setTypeDeVehicule(vehiculeDTO.getTypeDeVehicule());
        vehicule.setNumDeSeries(vehiculeDTO.getNumDeSeries());
        vehicule.setDateDeMiseEnRoute(vehiculeDTO.getDateDeMiseEnRoute());
        vehicule.setNumDeReference(vehiculeDTO.getNumDeReference());
        vehicule.setCapacite(vehiculeDTO.getCapacite());

        vehicule.setAgency(agency);
        Vehicule updatedVehicule = vehiculeRepository.save(vehicule);
        return new VehiculeDTO(updatedVehicule.getId(), updatedVehicule.getTypeDeVehicule(), updatedVehicule.getNumDeSeries(),
                updatedVehicule.getDateDeMiseEnRoute(), updatedVehicule.getNumDeReference(), updatedVehicule.getCapacite(),
                updatedVehicule.isActive(), updatedVehicule.getAgency().getId(), new AgencyDTO(updatedVehicule.getAgency().getId(),
                updatedVehicule.getAgency().getName(), updatedVehicule.getAgency().getAddress(),
                updatedVehicule.getAgency().getNomDeEntreprise(), updatedVehicule.getAgency().getEmail(),
                updatedVehicule.getAgency().getNumeroDeTelephone(), updatedVehicule.getAgency().getMatricule(),
                updatedVehicule.getAgency().getHoraireDeTravail(), updatedVehicule.getAgency().getSiteInternet(),
                updatedVehicule.getAgency().isActive(), updatedVehicule.getAgency().getVehicules().size(),
                updatedVehicule.getAgency().getDrivers().size()));
    }

    @Override
    public void deleteVehicule(Long id) {
        vehiculeRepository.deleteById(id);
    }

    @Override
    public VehiculeDTO activateVehicule(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found with id: " + id));
        vehicule.setActive(true);
        Vehicule updatedVehicule = vehiculeRepository.save(vehicule);
        return new VehiculeDTO(updatedVehicule.getId(), updatedVehicule.getTypeDeVehicule(), updatedVehicule.getNumDeSeries(),
                updatedVehicule.getDateDeMiseEnRoute(), updatedVehicule.getNumDeReference(), updatedVehicule.getCapacite(),
                updatedVehicule.isActive(), updatedVehicule.getAgency().getId(), new AgencyDTO(updatedVehicule.getAgency().getId(),
                updatedVehicule.getAgency().getName(), updatedVehicule.getAgency().getAddress(),
                updatedVehicule.getAgency().getNomDeEntreprise(), updatedVehicule.getAgency().getEmail(),
                updatedVehicule.getAgency().getNumeroDeTelephone(), updatedVehicule.getAgency().getMatricule(),
                updatedVehicule.getAgency().getHoraireDeTravail(), updatedVehicule.getAgency().getSiteInternet(),
                updatedVehicule.getAgency().isActive(), updatedVehicule.getAgency().getVehicules().size(),
                updatedVehicule.getAgency().getDrivers().size()));
    }

    @Override
    public VehiculeDTO deactivateVehicule(Long id) {
        Vehicule vehicule = vehiculeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicule not found with id: " + id));
        vehicule.setActive(false);
        Vehicule updatedVehicule = vehiculeRepository.save(vehicule);
        return new VehiculeDTO(updatedVehicule.getId(), updatedVehicule.getTypeDeVehicule(), updatedVehicule.getNumDeSeries(),
                updatedVehicule.getDateDeMiseEnRoute(), updatedVehicule.getNumDeReference(), updatedVehicule.getCapacite(),
                updatedVehicule.isActive(), updatedVehicule.getAgency().getId(), new AgencyDTO(updatedVehicule.getAgency().getId(),
                updatedVehicule.getAgency().getName(), updatedVehicule.getAgency().getAddress(),
                updatedVehicule.getAgency().getNomDeEntreprise(), updatedVehicule.getAgency().getEmail(),
                updatedVehicule.getAgency().getNumeroDeTelephone(), updatedVehicule.getAgency().getMatricule(),
                updatedVehicule.getAgency().getHoraireDeTravail(), updatedVehicule.getAgency().getSiteInternet(),
                updatedVehicule.getAgency().isActive(), updatedVehicule.getAgency().getVehicules().size(),
                updatedVehicule.getAgency().getDrivers().size()));
    }

    @Override
    public ResponseEntity<byte[]> exportVehiculesToExcel() {
        List<VehiculeDTO> vehicules = getAllActiveVehicules();
        String[] headers = {"Type de Vehicule", "Num de Series", "Date de Mise en Route", "Num de Reference", "Capacite", "Agence"};
        Function<VehiculeDTO, String[]> dataMapper = vehicule -> new String[] {
                vehicule.getTypeDeVehicule(),
                vehicule.getNumDeSeries(),
                vehicule.getDateDeMiseEnRoute(),
                vehicule.getNumDeReference(),
                vehicule.getCapacite(),
                vehicule.getAgence() != null ? vehicule.getAgence().getName() : "N/A"
        };
        try {
            byte[] excelBytes = fileService.exportToExcel(vehicules, headers, dataMapper);
            HttpHeaders responseHeaders = new HttpHeaders();
            responseHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            responseHeaders.setContentDispositionFormData("attachment", "vehicles.xlsx");
            return ResponseEntity.ok().headers(responseHeaders).body(excelBytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new byte[0]);
        }
    }
}