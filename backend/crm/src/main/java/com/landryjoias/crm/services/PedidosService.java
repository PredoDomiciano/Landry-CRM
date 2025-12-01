package com.landryjoias.crm.services;

import com.landryjoias.crm.dto.PedidoDTO;
import com.landryjoias.crm.entity.*;
import com.landryjoias.crm.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
    private final UsuarioRepository usuarioRepository; // Necessário para o Log funcionar

    @Transactional
    public PedidosEntity incluir(PedidoDTO dto) {
        
        // 1. Criar e Salvar o Cabeçalho (Vazio de itens inicialmente)
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

        // 2. Salvar os Itens um a um
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            for (PedidoDTO.ItemPedidoDTO itemDto : dto.getItens()) {
                
                ProdutosEntity produto = produtosRepository.findById(itemDto.getIdProduto())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado ID: " + itemDto.getIdProduto()));

                // Baixa de Estoque
                if (produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                    throw new RuntimeException("Estoque insuficiente: " + produto.getNome());
                }
                // (Opcional) Se quiseres baixar o estoque realmente, descomenta:
                // produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - itemDto.getQuantidade());
                // produtosRepository.save(produto);

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
        
        // --- A GRANDE CORREÇÃO (O RELOAD) ---
        // Em vez de retornar 'pedidoSalvo' (que está incompleto na memória),
        // buscamos o pedido completo no banco de dados. 
        // Como o PedidosEntity tem FetchType.EAGER, ele vai trazer os itens e o cliente agora.
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

            registrarLog("Pedido Editado", 
                "Pedido #" + id + " status: " + statusAntigo + " -> " + pedidos.getStatus());

            // Também fazemos reload aqui para garantir
            return pedidosRepository.findById(salvo.getIdPedido()).orElse(salvo);
        }
        return null;
    }

    public List<PedidosEntity> listarTodos() {
        return this.pedidosRepository.findAll();
    }

    public void excluir(Integer id) {
        if (pedidosRepository.existsById(id)) {
            pedidosRepository.deleteById(id);
            registrarLog("Pedido Excluído", "Pedido #" + id + " foi excluído.");
        }
    }

    // --- LOGS (CORRIGIDO PARA EVITAR ERRO 500) ---
    private UsuarioEntity getUsuarioReal() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UsuarioEntity) {
                UsuarioEntity userMemoria = (UsuarioEntity) auth.getPrincipal();
                // Busca o usuário oficial no banco para evitar erro de "Transient Instance"
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
            System.err.println("Erro ao salvar log (não crítico): " + e.getMessage());
        }
    }
}