package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.ClienteEntity;
import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.entity.NivelAcesso; // Importação essencial
import com.landryjoias.crm.repository.ClienteRepository;
import com.landryjoias.crm.repository.LogRepository;
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
public class ClienteService {
    private final ClienteRepository clienteRepository;
    private final LogRepository logRepository;

    @Transactional
    public ClienteEntity incluir(ClienteEntity cliente) {
        if (cliente.getContato() != null && cliente.getContato().getIdContato() != null && cliente.getContato().getIdContato() == 0) {
            cliente.getContato().setIdContato(null);
        }
        ClienteEntity salvo = clienteRepository.save(cliente);
        registrarLog("Cliente Criado", "Cliente '" + salvo.getNomeDoComercio() + "' cadastrado por " + getUsuarioLogadoEmail());
        return salvo;
    }

    @Transactional
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
                    "Acesso Negado: Apenas Administradores e Gerentes podem excluir clientes.");
            }
        }

        // 2. TENTATIVA DE EXCLUSÃO
        Optional<ClienteEntity> clienteOpt = clienteRepository.findById(id);
        
        if (clienteOpt.isPresent()) {
            ClienteEntity cliente = clienteOpt.get();
            String nome = cliente.getNomeDoComercio();
            
            try {
                clienteRepository.deleteById(id);
                clienteRepository.flush(); 
                
                registrarLog("Cliente Excluído", "Cliente '" + nome + "' removido por " + getUsuarioLogadoEmail());
            
            } catch (DataIntegrityViolationException e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, 
                    "Não é possível excluir: Este cliente possui Pedidos ou Oportunidades vinculados.");
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Erro ao excluir: " + e.getMessage());
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente não encontrado.");
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
            log.setAssunto("Gestão de Clientes");
            log.setDescricao(descricao);
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado());
            logRepository.save(log);
        } catch (Exception e) {}
    }
}