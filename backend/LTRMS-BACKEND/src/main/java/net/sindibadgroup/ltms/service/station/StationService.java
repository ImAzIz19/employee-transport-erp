package net.sindibadgroup.ltms.service.station;

import net.sindibadgroup.ltms.dto.station.StationDTO;
import net.sindibadgroup.ltms.dto.uploadResponse.FileVerificationDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StationService {
    List<StationDTO> getAll();
    List<StationDTO> getAllActive();
    StationDTO get(Integer id);
    StationDTO create(StationDTO dto);
    StationDTO modify(Integer id, StationDTO dto);
    StationDTO activate(Integer id);
    StationDTO deactivate(Integer id);
    void delete(Integer id);
    ResponseEntity<FileVerificationDTO> uploadFile(MultipartFile file) throws IOException;
    ResponseEntity<FileVerificationDTO> verifyFile(MultipartFile file) throws IOException;
    ResponseEntity<byte[]> downloadTemplate();
    ResponseEntity<byte[]> exportStationsToExcel();
}