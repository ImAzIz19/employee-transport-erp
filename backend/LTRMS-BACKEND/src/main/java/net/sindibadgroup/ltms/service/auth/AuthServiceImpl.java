package net.sindibadgroup.ltms.service.auth;

import jakarta.security.auth.message.AuthException;
import net.sindibadgroup.ltms.dto.auth.*;
import net.sindibadgroup.ltms.dto.user.UserEntityDTOMapper;
import net.sindibadgroup.ltms.model.role.Role;
import net.sindibadgroup.ltms.model.token.Token;
import net.sindibadgroup.ltms.model.token.TokenType;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.repository.PermissionRepository;
import net.sindibadgroup.ltms.repository.RoleRepository;
import net.sindibadgroup.ltms.repository.TokenRepository;
import net.sindibadgroup.ltms.repository.UserRepository;
import net.sindibadgroup.ltms.security.jwt.JwtService;
import net.sindibadgroup.ltms.service.email.EmailSenderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserEntityDTOMapper userEntityDTOMapper;
    private final PasswordEncoder passwordEncoder;
    private final EmailSenderService emailSenderService;
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    private final ObjectMapper objectMapper;

    private final Map<String, MFAData> verificationCodes = new ConcurrentHashMap<>();

    @Override
    public ResponseEntity<?> login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        UserEntity user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        String jwtToken = jwtService.generateJwtToken(user);
        String refreshToken = jwtService.generateJwtRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, refreshToken);
        AuthResponse logInResponse = AuthResponse.builder()
                .accesToken(jwtToken)
                .refrechToken(refreshToken)
                .userEntityDTO(userEntityDTOMapper.apply(user))
                .build();
        return ResponseEntity.ok(logInResponse);
    }

    @Override
    public ResponseEntity<?> register(RegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new AuthException("Email already in use: " + request.getEmail());
            }
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new AuthException("Role not found with ID: " + request.getRoleId()));
            UserEntity user = UserEntity.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .loginName(request.getLoginName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .roles(Set.of(role))
                    .orgId(request.getOrgId())
                    .isVerified(false)
                    .build();
            UserEntity savedUser = userRepository.save(user);
            String accessToken = jwtService.generateJwtToken(savedUser);
            String refreshToken = jwtService.generateJwtRefreshToken(savedUser);
            saveUserToken(savedUser, refreshToken);
            AuthResponse response = AuthResponse.builder()
                    .userEntityDTO(userEntityDTOMapper.apply(savedUser))
                    .accesToken(accessToken)
                    .refrechToken(refreshToken)
                    .build();
            return ResponseEntity.ok(response);
        } catch (AuthException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @Override
    @Transactional
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Missing or invalid Authorization header");
            return;
        }

        String refreshToken = authHeader.substring(7);
        String tokenType = jwtService.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid token type");
            return;
        }

        String userEmail = jwtService.getUserNameFromJwtToken(refreshToken);
        if (userEmail == null) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid refresh token");
            return;
        }

        UserEntity user = userRepository.findByEmail(userEmail)
                .orElse(null);
        if (user == null) {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "User not found");
            return;
        }

        boolean isTokenValid = tokenRepository.findByToken(refreshToken)
                .map(t -> !t.isExpired() && !t.isRevoked())
                .orElse(false);

        if (jwtService.isTokenValid(refreshToken, user) && isTokenValid) {
            tokenRepository.findByToken(refreshToken).ifPresent(token -> {
                token.setExpired(true);
                token.setRevoked(true);
                tokenRepository.save(token);
            });

            String newAccessToken = jwtService.generateJwtToken(user);
            String newRefreshToken = jwtService.generateJwtRefreshToken(user);
            saveUserToken(user, newRefreshToken);

            AuthResponse authResponse = AuthResponse.builder()
                    .accesToken(newAccessToken)
                    .refrechToken(newRefreshToken)
                    .build();
            objectMapper.writeValue(response.getOutputStream(), authResponse);
        } else {
            sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired refresh token");
        }
    }

    @Override
    public ResponseEntity<?> verifyEmail(String email) {
        try {
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            String code = String.format("%06d", new Random().nextInt(999999));
            verificationCodes.put(email, new MFAData(code, LocalDateTime.now().plusMinutes(5)));

            String emailBody = emailSenderService.emailVerificationCodeTemplate(
                    user.getFirstName() + " " + user.getLastName(), code);
            emailSenderService.sendEmail(email, "Your Verification Code", emailBody);

            return ResponseEntity.ok("MFA code sent successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> changePassword(ChangePasswordRequest request) {
        try {
            UserEntity user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setVerified(true);
            userRepository.save(user);

            revokeAllUserTokens(user);

            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @Override
    public ResponseEntity<?> verifyCode(String email, String code) {
        MFAData storedData = verificationCodes.get(email);

        if (storedData == null) {
            verificationCodes.remove(email);
            return ResponseEntity.badRequest().body("Invalid verification code");
        }

        if (LocalDateTime.now().isAfter(storedData.getExpirationTime())) {
            verificationCodes.remove(email);
            return ResponseEntity.badRequest().body("Verification code is expired");
        }

        boolean isValid = storedData.getCode().equals(code);

        if (isValid) {
            verificationCodes.remove(email);

            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            user.setVerified(true);
            userRepository.save(user);
            return ResponseEntity.ok("MFA verification successful.");
        }

        return ResponseEntity.badRequest().body("Invalid verification code");
    }

    private void revokeAllUserTokens(UserEntity user) {
        var validUserTokens = tokenRepository.findAllValidTokensByUser(user.getId());
        if (!validUserTokens.isEmpty()) {
            validUserTokens.forEach(token -> {
                token.setExpired(true);
                token.setRevoked(true);
            });
            tokenRepository.saveAll(validUserTokens);
        }
    }

    private void saveUserToken(UserEntity user, String jwtToken) {
        Token token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void sendError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        objectMapper.writeValue(response.getOutputStream(), Map.of("error", message));
    }
}