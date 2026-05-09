package net.sindibadgroup.ltms.service.user;

import net.sindibadgroup.ltms.dto.user.UserEntityDTO;
import java.util.List;

public interface UserManagerService {
    List<UserEntityDTO> getRhManagers();
    List<UserEntityDTO> getPsManagers();
    List<UserEntityDTO> getRhSegmentUsers();
    List<UserEntityDTO> getChefSegmentUsers();
    UserEntityDTO updateUser(Integer userId, UserEntityDTO userEntityDTO);
    List<UserEntityDTO> getAllUsers();
    void deleteUser(Integer userId); // Added delete method
}