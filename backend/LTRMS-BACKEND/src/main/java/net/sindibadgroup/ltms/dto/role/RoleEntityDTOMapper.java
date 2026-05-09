package net.sindibadgroup.ltms.dto.role;

import net.sindibadgroup.ltms.model.role.Role;
import org.springframework.stereotype.Component;

import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class RoleEntityDTOMapper implements Function<Role, RoleDTO> {
    @Override
    public RoleDTO apply(Role role) {
        return RoleDTO.builder()
                .id(role.getId())
                .name(role.getName())
                .permissions(role.getPermissions().stream()
                        .map(permission -> permission.getPermission())
                        .collect(Collectors.toSet()))
                .build();
    }
}