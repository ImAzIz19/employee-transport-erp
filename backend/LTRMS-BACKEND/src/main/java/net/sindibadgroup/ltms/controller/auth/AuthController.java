package net.sindibadgroup.ltms.controller.auth;

import net.sindibadgroup.ltms.dto.auth.AuthRequest;

import net.sindibadgroup.ltms.dto.auth.ChangePasswordRequest;
import net.sindibadgroup.ltms.dto.auth.EmailRequest;
import net.sindibadgroup.ltms.dto.auth.RegisterRequest;
import net.sindibadgroup.ltms.service.auth.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/auth")
public class AuthController {

    private AuthService authService;

    public AuthController (AuthService authService) {
        this.authService = authService;
    }



    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        return authService.register(registerRequest);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        return authService.login(authRequest);

    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody EmailRequest emailRequest) {
        return authService.verifyEmail(emailRequest.getEmail());
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        return authService.changePassword(request);
    }

    @PostMapping("/verify-mfa")
    public ResponseEntity<?> verifyMFA(@RequestBody EmailRequest emailRequest) {
        return authService.verifyCode(emailRequest.getEmail(), emailRequest.getCode());

    }


    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        authService.refreshToken(request,response);
    }


}
