package net.sindibadgroup.ltms.controller.user;

import net.sindibadgroup.ltms.dto.user.UserEntityDTO;
import net.sindibadgroup.ltms.service.user.UserManagerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserManagerController {

    private final UserManagerService userService;

    public UserManagerController(UserManagerService userService) {
        this.userService = userService;
    }

    @GetMapping("/rh-managers")
    public ResponseEntity<List<UserEntityDTO>> getRhManagers() {
        return ResponseEntity.ok(userService.getRhManagers());
    }

    @GetMapping("/ps-managers")
    public ResponseEntity<List<UserEntityDTO>> getPsManagers() {
        return ResponseEntity.ok(userService.getPsManagers());
    }

    @GetMapping("/rh-segment")
    public ResponseEntity<List<UserEntityDTO>> getRhSegmentUsers() {
        return ResponseEntity.ok(userService.getRhSegmentUsers());
    }

    @GetMapping("/chef-segment")
    public ResponseEntity<List<UserEntityDTO>> getChefSegmentUsers() {
        return ResponseEntity.ok(userService.getChefSegmentUsers());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserEntityDTO> updateUser(@PathVariable Integer userId, @RequestBody UserEntityDTO userEntityDTO) {
        return ResponseEntity.ok(userService.updateUser(userId, userEntityDTO));
    }

    @GetMapping
    public ResponseEntity<List<UserEntityDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer userId) {
        userService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}