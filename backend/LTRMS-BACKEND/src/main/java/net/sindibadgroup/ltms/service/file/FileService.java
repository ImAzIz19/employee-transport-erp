package net.sindibadgroup.ltms.service.file;

import net.sindibadgroup.ltms.dto.agency.AgencyDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

public interface FileService {
    ResponseEntity<Resource> downloadTemplate(String templateType);
    <T> byte[] exportToExcel(List<T> entities, String[] headers, Function<T, String[]> dataMapper) throws IOException;
}