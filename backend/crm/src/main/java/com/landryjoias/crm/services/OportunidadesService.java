package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.OportunidadesEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.entity.NivelAcesso; // Importação essencial
import com.landryjoias.crm.repository.LogRepository;
import com.landryjoias.crm.repository.OportunidadesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OportunidadesService {
    private final OportunidadesRepository repository;
    private final LogRepository logRepository;

    @Transactional
    public OportunidadesEntity incluir(OportunidadesEntity oportunidade) {
        OportunidadesEntity salvo = repository.save(oportunidade);
        registrarLog("Oportunidade Criada", "Nova oportunidade '" + salvo.getNomeOportunidade() + "' iniciada por " + getUsuarioLogadoEmail());
        return salvo;
    }

    @Transactional
    public OportunidadesEntity editar(int id, OportunidadesEntity novosDados) {
        Optional<OportunidadesEntity> existente = repository.findById(id);
        if (existente.isPresent()) {
            OportunidadesEntity atual = existente.get();
            String estagioAntigo = atual.getEstagioFunil() != null ? atual.getEstagioFunil().toString() : "N/A";
            
            atual.setNomeOportunidade(novosDados.getNomeOportunidade());
            atual.setValorEstimado(novosDados.getValorEstimado());
            atual.setEstagioFunil(novosDados.getEstagioFunil());
            atual.setDataDeFechamentoEstimada(novosDados.getDataDeFechamentoEstimada());
            atual.setCliente(novosDados.getCliente());

            OportunidadesEntity salvo = repository.save(atual);
            registrarLog("Oportunidade Atualizada", "Status de '" + salvo.getNomeOportunidade() + "' mudou (" + estagioAntigo + " -> " + salvo.getEstagioFunil() + ") por " + getUsuarioLogadoEmail());
            return salvo;
        }
        return null;
    }

    public List<OportunidadesEntity> listarTodos() {
        return repository.findAll();
    }

    @Transactional
    public void excluir(Integer id) {
        // 1. VERIFICAÇÃO DE PERMISSÃO (ADMIN ou GERENTE)
        UsuarioEntity usuarioLogado = getUsuarioLogado();
        
        if (usuarioLogado != null) {
            NivelAcesso nivel = usuarioLogado.getNivelAcesso();
            
            // Verifica se o nível é ADMINISTRADOR ou GERENTE
            boolean podeExcluir = nivel == NivelAcesso.ADMINISTRADOR || nivel == NivelAcesso.GERENTE;

            if (!podeExcluir) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                    "Permissão negada. Apenas Gerentes e Admins podem excluir oportunidades.");
            }
        }

        // 2. TENTATIVA DE EXCLUSÃO
        Optional<OportunidadesEntity> op = repository.findById(id);
        
        if (op.isPresent()) {
            String nome = op.get().getNomeOportunidade();
            try {
                repository.deleteById(id);
                repository.flush();
                registrarLog("Oportunidade Excluída", "Negociação '" + nome + "' removida por " + getUsuarioLogadoEmail());
            
            } catch (DataIntegrityViolationException e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, 
                    "Não é possível excluir: Esta oportunidade já gerou um Pedido ou possui vínculos.");
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno: " + e.getMessage());
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Oportunidade não encontrada.");
        }
    }

    // --- MÉTODOS AUXILIARES ---
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
            log.setAssunto("Vendas / Oportunidades");
            log.setDescricao(descricao);
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado());
            logRepository.save(log);
        } catch (Exception e) {}
    }
}