package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.OportunidadesEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.LogRepository;
import com.landryjoias.crm.repository.OportunidadesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OportunidadesService {
    private final OportunidadesRepository repository;
    private final LogRepository logRepository;

    public OportunidadesEntity incluir(OportunidadesEntity oportunidade) {
        OportunidadesEntity salvo = repository.save(oportunidade);
        registrarLog("Oportunidade Criada", "Nova oportunidade '" + salvo.getNomeOportunidade() + "' iniciada por " + getUsuarioLogadoEmail());
        return salvo;
    }

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

    public void excluir(Integer id) {
        Optional<OportunidadesEntity> op = repository.findById(id);
        if (op.isPresent()) {
            String nome = op.get().getNomeOportunidade();
            repository.deleteById(id);
            registrarLog("Oportunidade Excluída", "Negociação '" + nome + "' removida por " + getUsuarioLogadoEmail());
        }
    }

    // --- MÉTODOS DE LOG ---
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