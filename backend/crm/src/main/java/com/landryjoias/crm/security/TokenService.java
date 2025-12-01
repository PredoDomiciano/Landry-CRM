package com.landryjoias.crm.security;

import com.landryjoias.crm.entity.UsuarioEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class TokenService {

    // --- CORREÇÃO: Chave Fixa e Longa (Deve ter mais de 32 caracteres para HS256) ---
    // Assim o token não morre quando reinicias o servidor
    private static final String SECRET_STRING = "UmaSenhaMuitoSeguraParaOProjetoLandryJoias2024CRM";
    
    private final Key key = Keys.hmacShaKeyFor(SECRET_STRING.getBytes(StandardCharsets.UTF_8));

    public String gerarToken(UsuarioEntity usuario) {
        // Validade: 7 dias
        long expirationTime = 1000L * 60 * 60 * 24 * 7; 

        return Jwts.builder()
                .setSubject(usuario.getIdUsuario().toString())
                .claim("email", usuario.getEmail())
                .claim("nivel", usuario.getNivelAcesso())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) 
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Integer getUsuarioId(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token) // Se a chave mudasse, aqui daria erro
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