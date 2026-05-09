package net.sindibadgroup.ltms.service.vehicule;

import net.sindibadgroup.ltms.dto.vehicle.VehiculeDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface VehiculeService {
    VehiculeDTO createVehicule(VehiculeDTO vehiculeDTO);
    Optional<VehiculeDTO> getVehiculeById(Long id);
    List<VehiculeDTO> getAllVehicules();
    List<VehiculeDTO> getAllActiveVehicules();
    VehiculeDTO updateVehicule(Long id, VehiculeDTO vehiculeDTO);
    void deleteVehicule(Long id);
    VehiculeDTO activateVehicule(Long id);
    VehiculeDTO deactivateVehicule(Long id);
    ResponseEntity<byte[]> exportVehiculesToExcel();
}