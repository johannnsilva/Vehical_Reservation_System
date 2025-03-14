package com.example.mega.security;

import com.example.mega.util.JwtUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;


    public JwtRequestFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.getUsernameFromToken(jwt);
            } catch (IllegalArgumentException e) {
                System.err.println("IllegalArgumentException while extracting username from token: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Bad Request: Invalid token format");
                return;
            } catch (ExpiredJwtException e) {
                System.err.println("JWT Token is expired: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: JWT Token is expired");
                return;
            } catch (MalformedJwtException e) {
                System.err.println("JWT Token is malformed: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Bad Request: JWT Token is malformed");
                return;
            } catch (SignatureException e) {
                System.err.println("JWT signature is invalid: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: JWT signature is invalid");
                return;
            } catch (Exception e) {
                System.err.println("Exception while extracting username from token: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Internal Server Error: Token processing failed");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(jwt)) {
                    String role = jwtUtil.getRoleFromToken(jwt);
                    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                } else {
                    System.err.println("Token is invalid");
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.getWriter().write("Forbidden: Invalid JWT token");
                    return;
                }
            } catch (IllegalArgumentException e) {
                System.err.println("IllegalArgumentException during token validation or authentication setup: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Bad Request: Invalid token");
                return;
            } catch (ExpiredJwtException e) {
                System.err.println("JWT Token is expired during validation: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: JWT Token is expired");
                return;
            } catch (MalformedJwtException e) {
                System.err.println("JWT Token is malformed during validation: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("Bad Request: JWT Token is malformed");
                return;
            } catch (SignatureException e) {
                System.err.println("JWT signature is invalid during validation: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Unauthorized: JWT signature is invalid");
                return;
            } catch (Exception e) {
                System.err.println("Exception during token validation or authentication setup: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write("Internal Server Error: Authentication setup failed");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}