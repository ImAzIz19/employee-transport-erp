package net.sindibadgroup.ltms.controller.cotisation;

import net.sindibadgroup.ltms.service.file.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import net.sindibadgroup.ltms.service.cotisation.CotisationService;

@RestController
@RequestMapping("/api/cotisation")
public class CotisationController {

    @Autowired
    private FileService fileService;

    @Autowired
    private CotisationService cotisationService;

    @GetMapping("/template")
    public ResponseEntity<Resource> downloadTemplate() {
        return fileService.downloadTemplate("cotisation");
    }

    @PostMapping("/import-exoneration")
    public ResponseEntity<?> importExonerationData(@RequestParam("file") MultipartFile file) {
        return cotisationService.importExonerationData(file);
    }

    @GetMapping("/employees")
    public ResponseEntity<byte[]> getEmployeesByPlantSectionAndPeriod(
            @RequestParam("month") int month,
            @RequestParam("year") int year,
            @RequestParam("psId") int psId) {
        return cotisationService.getEmployeesByPlantSectionAndPeriod(month, year, psId);
    }
}