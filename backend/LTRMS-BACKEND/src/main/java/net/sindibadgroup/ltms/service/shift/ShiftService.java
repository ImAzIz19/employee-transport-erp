package net.sindibadgroup.ltms.service.shift;

import net.sindibadgroup.ltms.dto.shift.ShiftDTO;

import java.util.List;

public interface ShiftService {
    List<ShiftDTO> getAllShifts();
    ShiftDTO addShift(ShiftDTO shiftDTO);
    ShiftDTO modifyShift(Integer id, ShiftDTO shiftDTO);
    void deleteShift(Integer id);
}