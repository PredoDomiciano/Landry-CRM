package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.ProdutosEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.LogRepository;
import com.landryjoias.crm.repository.ProdutosRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProdutosService {
    
    private final ProdutosRepository produtosRepository;
    private final LogRepository logRepository; // Injetamos o repositório de logs

    public ProdutosEntity incluir(ProdutosEntity produto) {
        ProdutosEntity salvo = produtosRepository.save(produto);
        
        // --- LOG PERSONALIZADO ---
        registrarLog("Produto Criado", 
            "O produto '" + salvo.getNome() + "' foi criado por " + getUsuarioLogadoEmail());
        
        return salvo;
    }

    public ProdutosEntity editar(int id, ProdutosEntity novosDados) {
        Optional<ProdutosEntity> existente = produtosRepository.findById(id);
        
        if (existente.isPresent()) {
            ProdutosEntity produto = existente.get();
            String nomeAntigo = produto.getNome(); // Guarda o nome antigo para o log

            // Atualiza os dados
            produto.setNome(novosDados.getNome());
            produto.setDescricao(novosDados.getDescricao());
            produto.setTipo(novosDados.getTipo());
            produto.setTamanho(novosDados.getTamanho());
            produto.setValor(novosDados.getValor());
            produto.setQuantidadeEstoque(novosDados.getQuantidadeEstoque());
            produto.setMaterial(novosDados.getMaterial());
            produto.setTipoPedra(novosDados.getTipoPedra());
            produto.setCorPedra(novosDados.getCorPedra());
            produto.setTamanhoPersonalizado(novosDados.getTamanhoPersonalizado());

            ProdutosEntity salvo = produtosRepository.save(produto);

            // --- LOG PERSONALIZADO ---
            registrarLog("Produto Editado", 
                "O produto '" + nomeAntigo + "' foi alterado por " + getUsuarioLogadoEmail());

            return salvo;
        } else {
            return null;
        }
    }

    public void excluir(Integer id) {
        Optional<ProdutosEntity> produto = produtosRepository.findById(id);
        
        if (produto.isPresent()) {
            String nome = produto.get().getNome();
            produtosRepository.deleteById(id);
            
            // --- LOG PERSONALIZADO ---
            registrarLog("Produto Excluído", 
                "O produto '" + nome + "' foi excluído por " + getUsuarioLogadoEmail());
        }
    }

    public List<ProdutosEntity> listarTodos() {
        return produtosRepository.findAll();
    }

    // --- MÉTODOS AUXILIARES ---

    // Pega o email do usuário do Token JWT
    private String getUsuarioLogadoEmail() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UsuarioEntity) {
                return ((UsuarioEntity) authentication.getPrincipal()).getEmail();
            }
            return "Sistema"; // Fallback caso não ache
        } catch (Exception e) {
            return "Desconhecido";
        }
    }
    
    // Pega o objeto Usuário completo (para salvar o ID no log)
    private UsuarioEntity getUsuarioLogado() {
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UsuarioEntity) {
                return (UsuarioEntity) authentication.getPrincipal();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    // Salva o log no banco
    private void registrarLog(String titulo, String descricao) {
        try {
            LogEntity log = new LogEntity();
            log.setTitulo(titulo);
            log.setTipoDeAtividade(4); // 4 = Sistema
            log.setAssunto("Gestão de Produtos");
            log.setDescricao(descricao); // AQUI VAI A TUA FRASE PERSONALIZADA
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado()); // Vincula o ID do usuário real!
            
            logRepository.save(log);
        } catch (Exception e) {
            System.err.println("Erro ao salvar log: " + e.getMessage());
        }
    }
}