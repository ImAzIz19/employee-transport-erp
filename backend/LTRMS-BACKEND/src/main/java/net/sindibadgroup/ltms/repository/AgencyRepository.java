package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.agency.Agency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AgencyRepository extends JpaRepository<Agency, Long> {
    Optional<Agency> findByMatricule(String matricule);
    List<Agency> findByIsActiveTrue();
    Optional<Agency> findById(Long id);

}
