package net.sindibadgroup.ltms.service.busPlanification;

import net.sindibadgroup.ltms.dto.planification.BusPlanDTO;
import net.sindibadgroup.ltms.dto.planification.BusPlanRequestDTO;

import java.util.List;

public interface BusPlanService {
    List<BusPlanDTO> getAllByWeek(BusPlanRequestDTO requestDTO);
    List<BusPlanDTO> getByAgency(BusPlanRequestDTO requestDTO);
    BusPlanDTO modifyBusPlan(BusPlanRequestDTO requestDTO);
    void exportBusPlansToExcel(Long agencyId, String week);
}