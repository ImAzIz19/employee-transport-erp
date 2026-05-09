package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.driver.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    List<Driver> findByIsActiveTrue();

}