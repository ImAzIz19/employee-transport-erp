package net.sindibadgroup.ltms.service.user;

import net.sindibadgroup.ltms.dto.user.UserEntityDTO;
import net.sindibadgroup.ltms.dto.user.UserEntityDTOMapper;
import net.sindibadgroup.ltms.model.role.Role;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.repository.RoleRepository;
import net.sindibadgroup.ltms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserManagerServiceImpl implements UserManagerService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserEntityDTOMapper userEntityDTOMapper;

    @Override
    public List<UserEntityDTO> getRhManagers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> "RH_MANAGER".equals(role.getName())))
                .map(userEntityDTOMapper)
                .toList();
    }

    @Override
    public List<UserEntityDTO> getPsManagers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> "PS_MANAGER".equals(role.getName())))
                .map(userEntityDTOMapper)
                .toList();
    }

    @Override
    public List<UserEntityDTO> getRhSegmentUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> "RH_SEGMENT".equals(role.getName())))
                .map(userEntityDTOMapper)
                .toList();
    }

    @Override
    public List<UserEntityDTO> getChefSegmentUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> "CHEF_SEGMENT".equals(role.getName())))
                .map(userEntityDTOMapper)
                .toList();
    }

    @Override
    @Transactional
    public UserEntityDTO updateUser(Integer userId, UserEntityDTO userEntityDTO) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (userEntityDTO.firstName() != null && !userEntityDTO.firstName().isEmpty()) {
            user.setFirstName(userEntityDTO.firstName());
        }

        if (userEntityDTO.lastName() != null && !userEntityDTO.lastName().isEmpty()) {
            user.setLastName(userEntityDTO.lastName());
        }

        if (userEntityDTO.roles() != null) {
            Set<Role> roles = userEntityDTO.roles().stream()
                    .map(roleDTO -> roleRepository.findById(roleDTO.getId())
                            .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleDTO.getId())))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        UserEntity savedUser = userRepository.save(user);
        return userEntityDTOMapper.apply(savedUser);
    }

    @Override
    public List<UserEntityDTO> getAllUsers() {
        return userRepository.findAllWithRoles().stream()
                .map(userEntityDTOMapper)
                .toList();
    }

    @Override
    @Transactional
    public void deleteUser(Integer userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        userRepository.delete(user);
    }
}