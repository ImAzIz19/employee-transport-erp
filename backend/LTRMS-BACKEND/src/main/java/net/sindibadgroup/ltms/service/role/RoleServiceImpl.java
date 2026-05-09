package net.sindibadgroup.ltms.service.role;

import net.sindibadgroup.ltms.dto.role.RoleDTO;
import net.sindibadgroup.ltms.dto.role.RoleModifyDTO;
import net.sindibadgroup.ltms.model.role.Role;
import net.sindibadgroup.ltms.model.permission.Permission;
import net.sindibadgroup.ltms.repository.RoleRepository;
import net.sindibadgroup.ltms.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    @Autowired
    public RoleServiceImpl(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    private RoleDTO mapToDTO(Role role) {
        return RoleDTO.builder()
                .id(role.getId())
                .name(role.getName())
                .permissions(role.getPermissions().stream()
                        .map(Permission::getPermission)
                        .collect(Collectors.toSet()))
                .build();
    }

    private Role mapToEntity(RoleModifyDTO roleModifyDTO) {
        Role role = Role.builder()
                .name(roleModifyDTO.getName())
                .build();
        if (roleModifyDTO.getPermissions() != null) {
            Set<Permission> permissions = roleModifyDTO.getPermissions().stream()
                    .map(id -> permissionRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Permission not found with id: " + id)))
                    .collect(Collectors.toSet());
            role.setPermissions(permissions);
        }
        return role;
    }

    @Override
    @Transactional
    public RoleDTO createRole(RoleModifyDTO roleModifyDTO) {
        if (roleModifyDTO.getName() == null || roleModifyDTO.getName().isEmpty()) {
            throw new RuntimeException("Role name cannot be null or empty");
        }
        if (roleRepository.existsByName(roleModifyDTO.getName())) {
            throw new RuntimeException("Role with name " + roleModifyDTO.getName() + " already exists");
        }
        Role role = mapToEntity(roleModifyDTO);
        Role savedRole = roleRepository.save(role);
        return mapToDTO(savedRole);
    }

    @Override
    @Transactional
    public RoleDTO updateRole(Integer roleId, RoleModifyDTO roleModifyDTO) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));

        if (roleModifyDTO.getName() != null && !roleModifyDTO.getName().isEmpty()) {
            if (!role.getName().equals(roleModifyDTO.getName()) &&
                    roleRepository.existsByName(roleModifyDTO.getName())) {
                throw new RuntimeException("Role with name " + roleModifyDTO.getName() + " already exists");
            }
            role.setName(roleModifyDTO.getName());
        }

        if (roleModifyDTO.getPermissions() != null) {
            Set<Permission> permissions = roleModifyDTO.getPermissions().stream()
                    .map(id -> permissionRepository.findById(id)
                            .orElseThrow(() -> new RuntimeException("Permission not found with id: " + id)))
                    .collect(Collectors.toSet());
            role.setPermissions(permissions);
        }

        Role savedRole = roleRepository.save(role);
        return mapToDTO(savedRole);
    }

    @Override
    @Transactional
    public void deleteRole(Integer roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + roleId));
        roleRepository.delete(role);
    }

    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}