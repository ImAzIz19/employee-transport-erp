package net.sindibadgroup.ltms.service.role;

import net.sindibadgroup.ltms.dto.role.RoleDTO;
import net.sindibadgroup.ltms.dto.role.RoleModifyDTO;
import java.util.List;

public interface RoleService {
    RoleDTO createRole(RoleModifyDTO roleModifyDTO);
    RoleDTO updateRole(Integer roleId, RoleModifyDTO roleModifyDTO);
    void deleteRole(Integer roleId);
    List<RoleDTO> getAllRoles();
}