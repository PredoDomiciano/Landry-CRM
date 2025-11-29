package com.landryjoias.crm.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.landryjoias.crm.entity.ProdutoPedidoId;
import com.landryjoias.crm.entity.ProdutoPedidoEntity;
import com.landryjoias.crm.repository.Produto_pedidoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProdutoPedidoService {
    private final Produto_pedidoRepository produto_pedidoRepository;

    public ProdutoPedidoEntity incluir(ProdutoPedidoEntity produto_pedido) {

        return produto_pedidoRepository.save(produto_pedido);
    }

    public ProdutoPedidoEntity editar(ProdutoPedidoId id, ProdutoPedidoEntity produto_pedido) {
        // Verifique se a produto_pedido existe
        Optional<ProdutoPedidoEntity> produto_pedidoExistente = produto_pedidoRepository.findById(id);

        if (produto_pedidoExistente.isPresent()) {
            // Atualiza a produto_pedido
            ProdutoPedidoEntity produto_pedidoAtualizada = produto_pedidoExistente.get();
            produto_pedidoAtualizada.setPedra(produto_pedido.getPedra());
            produto_pedidoAtualizada.setQuantidade(produto_pedido.getQuantidade());
            produto_pedidoAtualizada.setValor(produto_pedido.getValor());
            produto_pedidoAtualizada.setTamanho(produto_pedido.getTamanho());
            // Atualiza os campos necessários
            return produto_pedidoRepository.save(produto_pedidoAtualizada); // Salva a produto_pedido atualizada
        } else {
            // Caso a produto_pedido não exista, retorna null
            return null;
        }
    }

    public List<ProdutoPedidoEntity> listarTodos() {
        return produto_pedidoRepository.findAll();
    }

    public void excluir(ProdutoPedidoId id) {
        produto_pedidoRepository.deleteById(id);
    }
}