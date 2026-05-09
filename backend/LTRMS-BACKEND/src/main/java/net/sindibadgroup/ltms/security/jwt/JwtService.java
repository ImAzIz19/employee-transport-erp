package net.sindibadgroup.ltms.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import net.sindibadgroup.ltms.model.user.UserEntity;
import net.sindibadgroup.ltms.security.utility.SecurityConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {
    private static final Logger log = LoggerFactory.getLogger(JwtService.class);

    private final Key accessKey;
    private final Key refreshKey;

    public JwtService() {
        this.accessKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SecurityConstants.JWT_ACCES_SECRET_KEY));
        this.refreshKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SecurityConstants.JWT_REFRESH_SECRET_KEY));
    }

    public String getUserNameFromJwtToken(String token) {
        try {
            return extractClaim(token, Claims::getSubject, refreshKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting username: {}", e.getMessage());
            return null;
        }
    }

    public String getIdFromJwtToken(String token) {
        try {
            return extractClaim(token, claims -> claims.get("id", String.class), accessKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting id: {}", e.getMessage());
            return null;
        }
    }

    public String getFirstNameFromJwtToken(String token) {
        try {
            return extractClaim(token, claims -> claims.get("firstName", String.class), accessKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting firstName: {}", e.getMessage());
            return null;
        }
    }

    public String getLastNameFromJwtToken(String token) {
        try {
            return extractClaim(token, claims -> claims.get("lastName", String.class), accessKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting lastName: {}", e.getMessage());
            return null;
        }
    }

    public String getEmailFromJwtToken(String token) {
        try {
            return extractClaim(token, claims -> claims.get("email", String.class), accessKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting email: {}", e.getMessage());
            return null;
        }
    }

    public List<String> getRolesFromJwtToken(String token) {
        try {
            List<?> roles = extractClaim(token, claims -> claims.get("roles", List.class), accessKey);
            return roles != null ?
                    roles.stream().filter(String.class::isInstance).map(String.class::cast).collect(Collectors.toList()) :
                    Collections.emptyList();
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting roles: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<String> getAuthoritiesFromJwtToken(String token) {
        try {
            List<?> authorities = extractClaim(token, claims -> claims.get("authorities", List.class), accessKey);
            return authorities != null ?
                    authorities.stream().filter(String.class::isInstance).map(String.class::cast).collect(Collectors.toList()) :
                    Collections.emptyList();
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting authorities: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public Boolean isVerifiedFromJwtToken(String token) {
        try {
            return extractClaim(token, claims -> claims.get("isVerified", Boolean.class), accessKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting isVerified: {}", e.getMessage());
            return false;
        }
    }

    public String getTokenType(String token) {
        try {
            return extractClaim(token, claims -> claims.get("type", String.class), refreshKey);
        } catch (JwtException e) {
            log.warn("Invalid JWT token when extracting type: {}", e.getMessage());
            return null;
        }
    }

    public String generateJwtToken(UserEntity userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", userDetails.getId().toString());
        claims.put("firstName", userDetails.getFirstName());
        claims.put("lastName", userDetails.getLastName());
        claims.put("email", userDetails.getEmail());
        claims.put("roles", userDetails.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toList()));
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        claims.put("isVerified", userDetails.isVerified());
        claims.put("type", "access");
        return buildToken(claims, userDetails, SecurityConstants.JWT_ACCES_EXPIRATION, accessKey);
    }

    public String generateJwtToken(Map<String, Object> extraClaims, UserEntity userDetails) {
        Map<String, Object> claims = new HashMap<>(extraClaims);
        claims.put("authorities", userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList()));
        claims.put("type", "access");
        return buildToken(claims, userDetails, SecurityConstants.JWT_ACCES_EXPIRATION, accessKey);
    }

    public String generateJwtRefreshToken(UserEntity user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return buildToken(claims, user, SecurityConstants.JWT_REFRESH_EXPIRATION, refreshKey);
    }

    private String buildToken(Map<String, Object> claims, UserEntity userDetails, long expirationTime, Key key) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            String username = getUserNameFromJwtToken(token);
            String tokenType = getTokenType(token);
            if (username == null || !username.equals(userDetails.getUsername()) || tokenType == null) {
                return false;
            }
            Key key = "access".equals(tokenType) ? accessKey : refreshKey;
            return !isTokenExpired(token, key);
        } catch (JwtException e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    private boolean isTokenExpired(String token, Key key) {
        return extractExpiration(token, key).before(new Date());
    }

    private Date extractExpiration(String token, Key key) {
        return extractClaim(token, Claims::getExpiration, key);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver, Key key) {
        Claims claims = extractAllClaims(token, key);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token, Key key) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}