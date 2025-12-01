package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.ClienteEntity;
import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.ClienteRepository;
import com.landryjoias.crm.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final LogRepository logRepository;

    public ClienteEntity incluir(ClienteEntity cliente) {
        if (cliente.getContato() != null && cliente.getContato().getIdContato() != null && cliente.getContato().getIdContato() == 0) {
            cliente.getContato().setIdContato(null);
        }
        ClienteEntity salvo = clienteRepository.save(cliente);
        
        registrarLog("Cliente Criado", "Cliente '" + salvo.getNomeDoComercio() + "' cadastrado por " + getUsuarioLogadoEmail());
        return salvo;
    }

    public ClienteEntity editar(int id, ClienteEntity novosDados) {
        Optional<ClienteEntity> existente = clienteRepository.findById(id);
        if (existente.isPresent()) {
            ClienteEntity cliente = existente.get();
            cliente.setNomeDoComercio(novosDados.getNomeDoComercio());
            cliente.setCNPJ(novosDados.getCNPJ());
            cliente.setEmail(novosDados.getEmail());

            if (novosDados.getContato() != null) {
                if (cliente.getContato() == null) {
                    cliente.setContato(novosDados.getContato());
                } else {
                    var contatoAtual = cliente.getContato();
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
            ClienteEntity salvo = clienteRepository.save(cliente);
            registrarLog("Cliente Editado", "Dados do cliente '" + salvo.getNomeDoComercio() + "' atualizados por " + getUsuarioLogadoEmail());
            return salvo;
        }
        return null;
    }

    public List<ClienteEntity> listarTodos() {
        return clienteRepository.findAll();
    }

    public void excluir(Integer id) {
        Optional<ClienteEntity> cliente = clienteRepository.findById(id);
        if (cliente.isPresent()) {
            String nome = cliente.get().getNomeDoComercio();
            clienteRepository.deleteById(id);
            registrarLog("Cliente Excluído", "Cliente '" + nome + "' removido por " + getUsuarioLogadoEmail());
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
            log.setAssunto("Gestão de Clientes");
            log.setDescricao(descricao);
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado());
            logRepository.save(log);
        } catch (Exception e) {}
    }
}