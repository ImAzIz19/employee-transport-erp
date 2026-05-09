package net.sindibadgroup.ltms.dto.user;

import net.sindibadgroup.ltms.dto.role.RoleDTO;
import java.util.Set;

public record UserEntityDTO(
        Integer id,
        String firstName,
        String lastName,
        String loginName,
        String email,
        boolean isVerified,
        Integer orgId ,
        Set<RoleDTO> roles
) {}