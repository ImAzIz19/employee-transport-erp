package net.sindibadgroup.ltms.service.permission;

import net.sindibadgroup.ltms.dto.permission.PermissionDTO;
import net.sindibadgroup.ltms.model.permission.Permission;
import net.sindibadgroup.ltms.repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PermissionServiceImpl implements PermissionService {

    private final PermissionRepository permissionRepository;

    @Autowired
    public PermissionServiceImpl(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    @PostConstruct
    @Transactional
    public void initPermissions() {
        List<Permission> defaultPermissions = Arrays.asList(
                Permission.AGENCY_CREATE, Permission.AGENCY_READ, Permission.AGENCY_UPDATE, Permission.AGENCY_DELETE,
                Permission.DRIVER_CREATE, Permission.DRIVER_READ, Permission.DRIVER_UPDATE, Permission.DRIVER_DELETE,
                Permission.DRIVER_STATUS, Permission.DRIVER_EXPORT,
                Permission.VEHICLE_CREATE, Permission.VEHICLE_READ, Permission.VEHICLE_UPDATE, Permission.VEHICLE_DELETE,
                Permission.VEHICLE_STATUS, Permission.VEHICLE_EXPORT,
                Permission.CIRCUIT_CREATE, Permission.CIRCUIT_READ, Permission.CIRCUIT_UPDATE, Permission.CIRCUIT_DELETE,
                Permission.CIRCUIT_STATUS,
                Permission.EMPLOYEE_CREATE, Permission.EMPLOYEE_READ, Permission.EMPLOYEE_UPDATE, Permission.EMPLOYEE_DELETE,
                Permission.EMPLOYEE_STATUS, Permission.EMPLOYEE_IMPORT, Permission.EMPLOYEE_EXPORT,
                Permission.PLANIFICATION_READ, Permission.PLANIFICATION_CREATE, Permission.PLANIFICATION_EXPORT,
                Permission.PLANIFICATION_MANUAL, Permission.PLANIFICATION_NOTIFICATION,
                Permission.PLANT_SECTION_CREATE, Permission.PLANT_SECTION_READ, Permission.PLANT_SECTION_UPDATE,
                Permission.PLANT_SECTION_DELETE, Permission.PLANT_SECTION_STATUS,
                Permission.SEGMENT_CREATE, Permission.SEGMENT_READ, Permission.SEGMENT_UPDATE, Permission.SEGMENT_DELETE,
                Permission.SEGMENT_STATUS,
                Permission.STATION_CREATE, Permission.STATION_READ, Permission.STATION_UPDATE, Permission.STATION_DELETE,
                Permission.STATION_STATUS, Permission.STATION_IMPORT, Permission.STATION_EXPORT
        );

        for (Permission permission : defaultPermissions) {
            if (!permissionRepository.findByPermission(permission.getPermission()).isPresent()) {
                permissionRepository.save(permission);
            }
        }
    }

    @Override
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
                .map(permission -> PermissionDTO.builder()
                        .id(permission.getId())
                        .permission(permission.getPermission())
                        .build())
                .collect(Collectors.toList());
    }
}