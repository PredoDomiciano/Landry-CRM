package com.landryjoias.crm.security;

import com.landryjoias.crm.entity.UsuarioEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    // Gera uma chave segura para o algoritmo HS256
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public String gerarToken(UsuarioEntity usuario) {
        return Jwts.builder()
                .setSubject(usuario.getIdUsuario().toString())
                .claim("email", usuario.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 dia
                .signWith(key, SignatureAlgorithm.HS256) // Assina com a chave
                .compact();
    }

    public Integer getUsuarioId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return Integer.parseInt(claims.getSubject());
    }

    public boolean isTokenValido(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}