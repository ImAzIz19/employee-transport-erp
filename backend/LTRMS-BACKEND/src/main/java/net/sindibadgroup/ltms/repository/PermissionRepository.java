package net.sindibadgroup.ltms.repository;

import net.sindibadgroup.ltms.model.permission.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Integer> {
    Optional<Permission> findByPermission(String permission);
}