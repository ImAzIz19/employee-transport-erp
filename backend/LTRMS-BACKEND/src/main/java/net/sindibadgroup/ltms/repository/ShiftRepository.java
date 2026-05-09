package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.shift.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Integer> {
    Optional<Shift> findByStartTimeAndEndTime(String startTime, String endTime);
}