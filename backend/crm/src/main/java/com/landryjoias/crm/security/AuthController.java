package com.landryjoias.crm.security;

import com.landryjoias.crm.dto.LoginDTO;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository repository;
    private final TokenService tokenService;
    private final PasswordEncoder passwordEncoder; // <-- ADICIONA ISSO

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dados) {

        // 1. Busca o usuário no banco
        UsuarioEntity usuario = repository.findByEmail(dados.getEmail())
                .orElse(null);

        if (usuario == null) {
            return ResponseEntity.status(401).body("Email ou senha inválidos");
        }

        // 2. Verifica senha criptografada com BCrypt
        if (!passwordEncoder.matches(dados.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(401).body("Email ou senha inválidos");
        }

        // 3. Gera token JWT
        String token = tokenService.gerarToken(usuario);

        return ResponseEntity.ok(Collections.singletonMap("token", token));
    }
}
