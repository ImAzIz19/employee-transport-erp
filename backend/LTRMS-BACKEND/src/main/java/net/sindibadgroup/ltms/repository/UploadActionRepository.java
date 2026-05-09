package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.action.UploadAction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UploadActionRepository extends JpaRepository<UploadAction, Integer> {
    Optional<UploadAction> findById(Integer id);
    List<UploadAction> findByTargetAction(String targetAction);
}