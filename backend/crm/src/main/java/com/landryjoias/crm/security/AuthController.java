package com.landryjoias.crm.security;

import com.landryjoias.crm.dto.LoginDTO;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.UsuarioRepository;
import com.landryjoias.crm.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Collections;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dados) {
        // Busca usuário pelo email
        UsuarioEntity usuario = repository.findByEmail(dados.getEmail())
                .orElse(null);

        // Verifica se existe e se a senha bate
        if (usuario != null && usuario.getSenha().equals(dados.getSenha())) {
            String token = tokenService.gerarToken(usuario);
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        }

        return ResponseEntity.status(401).body("Email ou senha inválidos");
    }
}