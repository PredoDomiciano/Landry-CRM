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

    @Transactional
    public PedidosEntity incluir(PedidoDTO dto) {
        
        // 1. Criar o cabeçalho do Pedido
        PedidosEntity pedido = new PedidosEntity();
        pedido.setData(dto.getData());
        pedido.setStatus(dto.getStatus());
        // Converter valor total (assumindo que o DTO traz Double e o banco/entity usa int ou float)
        // Se a sua entity usa Integer: dto.getValorTotal().intValue()
        // Se a sua entity usa Float: dto.getValorTotal().floatValue()
        pedido.setValorTotal(dto.getValorTotal().intValue()); 

        // 2. Vincular Oportunidade (se existir)
        if (dto.getIdOportunidade() != null) {
            OportunidadesEntity op = oportunidadesRepository.findById(dto.getIdOportunidade())
                    .orElse(null);
            pedido.setOportunidade(op);
        }

        // 3. Salvar Pedido (para gerar o ID)
        PedidosEntity pedidoSalvo = pedidosRepository.save(pedido);

        // 4. Salvar Itens
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            for (PedidoDTO.ItemPedidoDTO itemDto : dto.getItens()) {
                
                // Busca Produto no Banco
                ProdutosEntity produto = produtosRepository.findById(itemDto.getIdProduto())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado ID: " + itemDto.getIdProduto()));

                // Validação de Estoque
                if (produto.getQuantidadeEstoque() < itemDto.getQuantidade()) {
                    throw new RuntimeException("Estoque insuficiente para: " + produto.getNome() + 
                                             ". Disponível: " + produto.getQuantidadeEstoque());
                }

                // Cria Objeto de Ligação (Item)
                ProdutoPedidoEntity itemEntity = new ProdutoPedidoEntity();
                
                // ID Composto
                ProdutoPedidoId id = new ProdutoPedidoId(pedidoSalvo.getIdPedido(), produto.getIdProduto());
                itemEntity.setId(id);
                
                // Relacionamentos
                itemEntity.setPedido(pedidoSalvo);
                itemEntity.setProduto(produto);
                
                // Dados Simples
                itemEntity.setQuantidade(itemDto.getQuantidade());
                itemEntity.setValor(itemDto.getValor().floatValue());
                itemEntity.setPedra(itemDto.getPedra());

                // --- LÓGICA DE TAMANHO (Enum vs Personalizado) ---
                try {
                    // Tenta converter o texto (ex: "ARO_12") para o Enum
                    Tamanho tamanhoEnum = Tamanho.valueOf(itemDto.getTamanho());
                    itemEntity.setTamanho(tamanhoEnum);
                    itemEntity.setTamanhoPersonalizado(null);
                } catch (IllegalArgumentException | NullPointerException e) {
                    // Se falhar (ex: cliente digitou "15.5" ou veio vazio), define como PERSONALIZADO
                    itemEntity.setTamanho(Tamanho.PERSONALIZADO);
                    // Guarda o valor real escrito no campo texto extra
                    itemEntity.setTamanhoPersonalizado(itemDto.getTamanho());
                }

                // Salva o Item (Trigger SQL de baixa de estoque roda aqui)
                itemRepository.save(itemEntity);
            }
        }

        // Auditoria
        registrarLog("Pedido Criado", "Pedido #" + pedidoSalvo.getIdPedido() + " criado com sucesso por " + getIdentificacaoUsuario());
        
        return pedidoSalvo;
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
                "O pedido #" + id + " mudou de status (" + statusAntigo + " -> " + pedidos.getStatus() + ") por " + getIdentificacaoUsuario());

            return salvo;
        }
        return null;
    }

    public List<PedidosEntity> listarTodos() {
        return this.pedidosRepository.findAll();
    }

    public void excluir(Integer id) {
        if (pedidosRepository.existsById(id)) {
            pedidosRepository.deleteById(id);
            registrarLog("Pedido Excluído", "O pedido #" + id + " foi excluído por " + getIdentificacaoUsuario());
        }
    }

    // --- MÉTODOS DE LOG ---
    private String getIdentificacaoUsuario() {
        try {
            var auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getPrincipal() instanceof UsuarioEntity) {
                UsuarioEntity user = (UsuarioEntity) auth.getPrincipal();
                // Tenta nome, se não tiver, vai email
                // Assumindo que criaste o getNomeCompleto na entidade Usuario, senão use getEmail
                return user.getEmail(); 
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
            log.setTipoDeAtividade(4); // 4 = Sistema
            log.setAssunto("Gestão de Pedidos");
            log.setDescricao(descricao);
            log.setData(LocalDateTime.now());
            log.setUsuario(getUsuarioLogado());
            logRepository.save(log);
        } catch (Exception e) { System.err.println("Erro Log: " + e.getMessage()); }
    }
}