package net.sindibadgroup.ltms.dto.user;

import net.sindibadgroup.ltms.dto.role.RoleEntityDTOMapper;
import net.sindibadgroup.ltms.model.user.UserEntity;
import org.springframework.stereotype.Component;

import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class UserEntityDTOMapper implements Function<UserEntity, UserEntityDTO> {

    private final RoleEntityDTOMapper roleEntityDTOMapper;

    public UserEntityDTOMapper(RoleEntityDTOMapper roleEntityDTOMapper) {
        this.roleEntityDTOMapper = roleEntityDTOMapper;
    }

    @Override
    public UserEntityDTO apply(UserEntity user) {
        return new UserEntityDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getLoginName(),
                user.getEmail(),
                user.isVerified(),
                user.getOrgId(),
                user.getRoles().stream()
                        .map(roleEntityDTOMapper)
                        .collect(Collectors.toSet())
        );
    }
}