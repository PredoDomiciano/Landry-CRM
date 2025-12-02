package com.landryjoias.crm.services;

import com.landryjoias.crm.dto.PedidoDTO;
import com.landryjoias.crm.entity.*;
import com.landryjoias.crm.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PedidosService {
    private final PedidosRepository pedidosRepository;
    private final Produto_pedidoRepository itemRepository;
    private final ProdutosRepository produtosRepository;
    private final OportunidadesRepository oportunidadesRepository;
    private final LogRepository logRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public PedidosEntity incluir(PedidoDTO dto) {
        // 1. Criar e Salvar o Cabeçalho
        PedidosEntity pedido = new PedidosEntity();
        pedido.setData(dto.getData());
        pedido.setStatus(dto.getStatus());
        pedido.setValorTotal(dto.getValorTotal().intValue()); 

        if (dto.getIdOportunidade() != null) {
            OportunidadesEntity op = oportunidadesRepository.findById(dto.getIdOportunidade())
                    .orElse(null);
            pedido.setOportunidade(op);
        }

        PedidosEntity pedidoSalvo = pedidosRepository.save(pedido);

        // 2. Salvar os Itens
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            for (PedidoDTO.ItemPedidoDTO itemDto : dto.getItens()) {
                ProdutosEntity produto = produtosRepository.findById(itemDto.getIdProduto())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado ID: " + itemDto.getIdProduto()));

                ProdutoPedidoEntity itemEntity = new ProdutoPedidoEntity();
                ProdutoPedidoId id = new ProdutoPedidoId(pedidoSalvo.getIdPedido(), produto.getIdProduto());
                itemEntity.setId(id);
                itemEntity.setPedido(pedidoSalvo);
                itemEntity.setProduto(produto);
                itemEntity.setQuantidade(itemDto.getQuantidade());
                itemEntity.setValor(itemDto.getValor().floatValue());
                itemEntity.setPedra(itemDto.getPedra());

                try {
                    Tamanho tamanhoEnum = Tamanho.valueOf(itemDto.getTamanho());
                    itemEntity.setTamanho(tamanhoEnum);
                } catch (Exception e) {
                    itemEntity.setTamanho(Tamanho.PERSONALIZADO);
                    itemEntity.setTamanhoPersonalizado(itemDto.getTamanho());
                }

                itemRepository.save(itemEntity);
            }
        }

        registrarLog("Pedido Criado", "Pedido #" + pedidoSalvo.getIdPedido() + " criado com sucesso.");
        
        return pedidosRepository.findById(pedidoSalvo.getIdPedido())
                .orElse(pedidoSalvo);
    }

    public PedidosEntity editar(int id, PedidosEntity pedidos) {
        Optional<PedidosEntity> existente = this.pedidosRepository.findById(id);
        if (existente.isPresent()) {
            PedidosEntity atual = existente.get();
            String statusAntigo = atual.getStatus() != null ? atual.getStatus().toString() : "N/A";
            
            atual.setData(pedidos.getData());
            atual.setValorTotal(pedidos.getValorTotal());
            atual.setStatus(pedidos.getStatus());
            
            PedidosEntity salvo = this.pedidosRepository.save(atual);
            registrarLog("Pedido Editado", "Pedido #" + id + " status: " + statusAntigo + " -> " + pedidos.getStatus());
            
            return pedidosRepository.findById(salvo.getIdPedido()).orElse(salvo);
        }
        return null;
    }

    public List<PedidosEntity> listarTodos() {
        return this.pedidosRepository.findAll();
    }

    // --- EXCLUSÃO BLINDADA ---
    @Transactional
    public void excluir(Integer id) {
        // 1. Verificação de Permissão (ADMIN ou GERENTE)
        UsuarioEntity usuarioLogado = getUsuarioReal();
        if (usuarioLogado != null) {
             NivelAcesso nivel = usuarioLogado.getNivelAcesso();
             boolean podeExcluir = nivel == NivelAcesso.ADMINISTRADOR || nivel == NivelAcesso.GERENTE;
             if (!podeExcluir) {
                 throw new ResponseStatusException(HttpStatus.FORBIDDEN, 
                     "Acesso Negado: Apenas Gerentes e Admins podem excluir pedidos.");
             }
        }

        // 2. Lógica de Exclusão
        Optional<PedidosEntity> pedidoOpt = pedidosRepository.findById(id);
        
        if (pedidoOpt.isPresent()) {
            PedidosEntity pedido = pedidoOpt.get();
            try {
                // PASSO CRUCIAL: Apagar os itens do pedido ANTES de apagar o pedido
                // Isso evita o erro de chave estrangeira (FK)
                if (pedido.getItens() != null && !pedido.getItens().isEmpty()) {
                    itemRepository.deleteAll(pedido.getItens());
                }

                pedidosRepository.delete(pedido);
                pedidosRepository.flush(); // Força o banco a confirmar a exclusão agora

                registrarLog("Pedido Excluído", "Pedido #" + id + " removido permanentemente.");
            
            } catch (DataIntegrityViolationException e) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, 
                    "Não é possível excluir: O pedido possui vínculos no sistema.");
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, 
                    "Erro ao excluir pedido: " + e.getMessage());
            }
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido não encontrado.");
        }
    }

    // --- MÉTODOS AUXILIARES ---
    private UsuarioEntity getUsuarioReal() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UsuarioEntity) {
                UsuarioEntity userMemoria = (UsuarioEntity) auth.getPrincipal();
                return usuarioRepository.findByEmail(userMemoria.getEmail()).orElse(null);
            }
            return null;
        } catch (Exception e) { return null; }
    }

    private void registrarLog(String titulo, String descricao) {
        try {
            LogEntity log = new LogEntity();
            log.setTitulo(titulo);
            log.setTipoDeAtividade(4);
            log.setAssunto("Gestão de Pedidos");
            UsuarioEntity usuarioReal = getUsuarioReal();
            String nomeUser = usuarioReal != null ? usuarioReal.getEmail() : "Sistema";
            log.setDescricao(descricao + " por " + nomeUser);
            log.setData(LocalDateTime.now());
            log.setUsuario(usuarioReal);
            logRepository.save(log);
        } catch (Exception e) {
            System.err.println("Erro ao salvar log: " + e.getMessage());
        }
    }
}