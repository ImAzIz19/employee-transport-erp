package net.sindibadgroup.ltms.controller.role;

import net.sindibadgroup.ltms.dto.role.RoleDTO;
import net.sindibadgroup.ltms.dto.role.RoleModifyDTO;

import net.sindibadgroup.ltms.service.role.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    @Autowired
    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping("/create")
    public RoleDTO createRole(@RequestBody RoleModifyDTO roleModifyDTO) {
        return roleService.createRole(roleModifyDTO);
    }

    @PutMapping("/update/{roleId}")
    public RoleDTO updateRole(@PathVariable Integer roleId, @RequestBody RoleModifyDTO roleModifyDTO) {
        return roleService.updateRole(roleId, roleModifyDTO);
    }

    @DeleteMapping("/delete/{roleId}")
    public void deleteRole(@PathVariable Integer roleId) {
        roleService.deleteRole(roleId);
    }

    @GetMapping("/get-all")
    public List<RoleDTO> getAllRoles() {
        return roleService.getAllRoles();
    }
}