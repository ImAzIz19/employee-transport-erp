package net.sindibadgroup.ltms.controller.permission;

import net.sindibadgroup.ltms.dto.permission.PermissionDTO;
import net.sindibadgroup.ltms.model.permission.Permission;
import net.sindibadgroup.ltms.service.permission.PermissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
public class PermissionController {

    private final PermissionService permissionService;

    @Autowired
    public PermissionController(PermissionService permissionService) {
        this.permissionService = permissionService;
    }

    @GetMapping("get-all")
    public List<PermissionDTO> getAllPermissions() {
        return permissionService.getAllPermissions();
    }
}
