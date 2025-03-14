package com.example.mega.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private Long expiration;

    @Value("${jwt.refreshExpiration}")
    private Long refreshExpiration;

    private SecretKey getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            byte[] paddedKeyBytes = new byte[32];
            System.arraycopy(keyBytes, 0, paddedKeyBytes, 0, keyBytes.length);
            return Keys.hmacShaKeyFor(paddedKeyBytes);
        } else {
             return Keys.hmacShaKeyFor(keyBytes);
        }

    }

    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return createToken(claims, username, expiration);
    }

    public String generateRefreshToken(String username) {
        return createToken(new HashMap<>(), username, refreshExpiration);
    }

    private String createToken(Map<String, Object> claims, String subject, Long expirationTime) {
        return Jwts.builder().setClaims(claims).setSubject(subject).setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime * 1000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512).compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token).getBody();
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

   public Boolean validateToken(String token) {
        return !isTokenExpired(token);
    }

    public Boolean validateRefreshToken(String token) {
        return !isTokenExpired(token);
    }


    public String getRoleFromToken(String token) {
          Claims claims = getAllClaimsFromToken(token);
            return (String) claims.get("role");
    }
}