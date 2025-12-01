package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.LogRepository;
import com.landryjoias.crm.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final LogRepository logRepository;

    public UsuarioEntity incluir(UsuarioEntity usuario) {
        UsuarioEntity salvo = usuarioRepository.save(usuario);
        registrarLog("Usuário Criado", "Novo login criado para: " + salvo.getEmail() + " por " + getUsuarioLogadoEmail());
        return salvo;
    }

    public UsuarioEntity editar(int id, UsuarioEntity usuario) {
        Optional<UsuarioEntity> usuarioExistente = usuarioRepository.findById(id);
        if (usuarioExistente.isPresent()) {
            UsuarioEntity usuarioAtualizado = usuarioExistente.get();
            usuarioAtualizado.setEmail(usuario.getEmail());
            usuarioAtualizado.setSenha(usuario.getSenha());
            usuarioAtualizado.setNivelAcesso(usuario.getNivelAcesso());
            
            UsuarioEntity salvo = usuarioRepository.save(usuarioAtualizado);
            registrarLog("Usuário Alterado", "Credenciais de " + salvo.getEmail() + " alteradas por " + getUsuarioLogadoEmail());
            return salvo;
        }
        return null;
    }

    public List<UsuarioEntity> listarTodos() {
        return usuarioRepository.findAll();
    }

    public void excluir(Integer id) {
        Optional<UsuarioEntity> user = usuarioRepository.findById(id);
        if (user.isPresent()) {
            String email = user.get().getEmail();
            usuarioRepository.deleteById(id);
            registrarLog("Usuário Excluído", "Login " + email + " revogado por " + getUsuarioLogadoEmail());
        }
    }

    // --- LOGS ---
    private String getUsuarioLogadoEmail() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UsuarioEntity) {
                return ((UsuarioEntity) auth.getPrincipal()).getEmail();
            }
            return "Sistema";
        } catch (Exception e) { return "Desconhecido"; }
    }
    
    private UsuarioEntity getUsuarioLogado() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UsuarioEntity) {
                return (UsuarioEntity) auth.getPrincipal();
            }
            return null;
        } catch (Exception e) { return null; }
    }

    private void registrarLog(String titulo, String descricao) {
        try {
            LogEntity log = new LogEntity();
            log.setTitulo(titulo);
            log.setTipoDeAtividade(4);
            log.setAssunto("Segurança / Usuários");
            log.setDescricao(descricao);
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado());
            logRepository.save(log);
        } catch (Exception e) {}
    }
}