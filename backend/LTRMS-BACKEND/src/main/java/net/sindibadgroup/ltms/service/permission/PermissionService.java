package net.sindibadgroup.ltms.service.permission;

import net.sindibadgroup.ltms.dto.permission.PermissionDTO;
import java.util.List;

public interface PermissionService {
    List<PermissionDTO> getAllPermissions();
}