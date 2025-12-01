package com.landryjoias.crm.security; // ou .security se estiver lá

import com.landryjoias.crm.dto.LoginDTO; // Certifica-te que tens este DTO
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.UsuarioRepository;
import com.landryjoias.crm.security.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioRepository repository;
    private final TokenService tokenService; // <--- Agora deve aparecer como "usado"

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dados) {
        // 1. Busca o usuário no banco
        UsuarioEntity usuario = repository.findByEmail(dados.getEmail())
                .orElse(null);

        // 2. Verifica senha (em texto puro por enquanto)
        if (usuario != null && usuario.getSenha().equals(dados.getSenha())) {
            // 3. Gera o token JWT
            String token = tokenService.gerarToken(usuario);

            // 4. Retorna o token para o frontend
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        }

        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }
}