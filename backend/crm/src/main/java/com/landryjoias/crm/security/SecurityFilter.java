package com.landryjoias.crm.security;

import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = recuperarToken(request);

        if (token != null) {
            var valido = tokenService.isTokenValido(token);
            // LOG PARA DEBUG
            System.out.println("---- FILTRO DE SEGURANÇA ----");
            System.out.println("Token recebido: Sim");
            System.out.println("Token válido? " + valido);

            if (valido) {
                var idUsuario = tokenService.getUsuarioId(token); // Verifique se isso retorna Long ou Integer
                System.out.println("ID no Token: " + idUsuario);
                
                // Cuidado: Verifique se seu ID é Long ou Integer. O findById precisa bater o tipo.
                UsuarioEntity usuario = usuarioRepository.findById(idUsuario).orElse(null);

                if (usuario != null) {
                    System.out.println("Usuário encontrado: " + usuario.getEmail());
                    System.out.println("Nível Acesso: " + usuario.getNivelAcesso()); // Supondo que tenha esse get

                    // --- CORREÇÃO IMPORTANTE ---
                    // Estamos forçando o papel do usuário baseado no banco
                    // Se o seu usuario implementa UserDetails, use: usuario.getAuthorities()
                    // Se não, criamos manualmente assim:
                    var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + usuario.getNivelAcesso()));
                    
                    var authentication = new UsernamePasswordAuthenticationToken(usuario, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out.println("Usuário autenticado com sucesso no Contexto!");
                } else {
                    System.out.println("ERRO: Usuário não encontrado no banco com o ID do token.");
                }
            }
        } else {
            // Apenas para saber se passou sem token (ex: Login ou rotas publicas)
            // System.out.println("Requisição sem token (Pode ser normal para Login/Options)");
        }

        filterChain.doFilter(request, response);
    }

    private String recuperarToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}