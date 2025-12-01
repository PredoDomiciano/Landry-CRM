package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.FuncionarioEntity;
import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.FuncionarioRepository;
import com.landryjoias.crm.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FuncionarioService {
    private final FuncionarioRepository funcionarioRepository;
    private final LogRepository logRepository;

    public FuncionarioEntity incluir(FuncionarioEntity funcionario) {
        if (funcionario.getContato() != null && funcionario.getContato().getIdContato() != null && funcionario.getContato().getIdContato() == 0) {
            funcionario.getContato().setIdContato(null);
        }
        FuncionarioEntity salvo = funcionarioRepository.save(funcionario);
        registrarLog("Funcionário Contratado", "Colaborador '" + salvo.getNome() + "' (" + salvo.getCargo() + ") adicionado por " + getUsuarioLogadoEmail());
        return salvo;
    }

    public FuncionarioEntity editar(int id, FuncionarioEntity novosDados) {
        Optional<FuncionarioEntity> existente = funcionarioRepository.findById(id);
        if (existente.isPresent()) {
            FuncionarioEntity funcionario = existente.get();
            funcionario.setNome(novosDados.getNome());
            funcionario.setCpf(novosDados.getCpf());
            funcionario.setCargo(novosDados.getCargo());
            funcionario.setEmail(novosDados.getEmail());
            
            if (novosDados.getContato() != null) {
                if (funcionario.getContato() == null) {
                    funcionario.setContato(novosDados.getContato());
                } else {
                    var contatoAtual = funcionario.getContato();
                    var novoContato = novosDados.getContato();
                    contatoAtual.setRua(novoContato.getRua());
                    contatoAtual.setBairro(novoContato.getBairro());
                    contatoAtual.setCidade(novoContato.getCidade());
                    contatoAtual.setEstado(novoContato.getEstado());
                    contatoAtual.setCep(novoContato.getCep());
                    contatoAtual.setNumeroCasa(novoContato.getNumeroCasa());
                    contatoAtual.setTelefone(novoContato.getTelefone());
                }
            }
            FuncionarioEntity salvo = funcionarioRepository.save(funcionario);
            registrarLog("Funcionário Editado", "Dados de '" + salvo.getNome() + "' atualizados por " + getUsuarioLogadoEmail());
            return salvo;
        }
        return null;
    }

    public List<FuncionarioEntity> listarTodos() {
        return funcionarioRepository.findAll();
    }

    public void excluir(Integer id) {
        Optional<FuncionarioEntity> func = funcionarioRepository.findById(id);
        if (func.isPresent()) {
            String nome = func.get().getNome();
            funcionarioRepository.deleteById(id);
            registrarLog("Funcionário Demitido/Excluído", "Colaborador '" + nome + "' removido por " + getUsuarioLogadoEmail());
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
            log.setAssunto("RH / Funcionários");
            log.setDescricao(descricao);
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado());
            logRepository.save(log);
        } catch (Exception e) {}
    }
}