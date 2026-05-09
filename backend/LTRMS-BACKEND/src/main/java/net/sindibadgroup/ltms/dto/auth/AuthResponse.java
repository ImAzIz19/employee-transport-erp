package net.sindibadgroup.ltms.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.sindibadgroup.ltms.dto.user.UserEntityDTO;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private UserEntityDTO userEntityDTO;
    private String accesToken;
    private String refrechToken;

}
