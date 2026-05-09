package net.sindibadgroup.ltms.service.shift;

import net.sindibadgroup.ltms.dto.shift.ShiftDTO;
import net.sindibadgroup.ltms.model.shift.Shift;
import net.sindibadgroup.ltms.repository.ShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShiftServiceImpl implements ShiftService {

    private final ShiftRepository shiftRepository;

    @Override
    public List<ShiftDTO> getAllShifts() {
        return shiftRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ShiftDTO addShift(ShiftDTO shiftDTO) {
        Shift shift = new Shift();
        shift.setStartTime(shiftDTO.getStartTime());
        shift.setEndTime(shiftDTO.getEndTime());
        shift.setMode(shiftDTO.getMode());

        Shift savedShift = shiftRepository.save(shift);
        return convertToDTO(savedShift);
    }

    @Override
    public ShiftDTO modifyShift(Integer id, ShiftDTO shiftDTO) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));

        shift.setStartTime(shiftDTO.getStartTime());
        shift.setEndTime(shiftDTO.getEndTime());
        shift.setMode(shiftDTO.getMode());

        Shift updatedShift = shiftRepository.save(shift);
        return convertToDTO(updatedShift);
    }

    @Override
    public void deleteShift(Integer id) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found"));
        shiftRepository.delete(shift);
    }

    private ShiftDTO convertToDTO(Shift shift) {
        return ShiftDTO.builder()
                .id(shift.getId())
                .startTime(shift.getStartTime())
                .endTime(shift.getEndTime())
                .mode(shift.getMode())
                .build();
    }
}