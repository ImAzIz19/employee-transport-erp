package net.sindibadgroup.ltms.service.auth;

import net.sindibadgroup.ltms.dto.auth.AuthRequest;
import net.sindibadgroup.ltms.dto.auth.ChangePasswordRequest;
import net.sindibadgroup.ltms.dto.auth.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface AuthService {
    public ResponseEntity<?> login(@NotNull AuthRequest request);
    public ResponseEntity<?> register(@NotNull RegisterRequest request);
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
    public ResponseEntity<?> verifyEmail(final String email);
    public ResponseEntity<?> changePassword(ChangePasswordRequest request);
    public ResponseEntity<?>  verifyCode(String email, String code);
}
