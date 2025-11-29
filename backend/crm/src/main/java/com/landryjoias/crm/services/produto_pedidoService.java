package com.landryjoias.crm.services;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.landryjoias.crm.entity.produtoPedidoId;
import com.landryjoias.crm.entity.produto_pedidoEntity;
import com.landryjoias.crm.repository.produto_pedidoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class produto_pedidoService {
    private final produto_pedidoRepository produto_pedidoRepository;

    public produto_pedidoEntity incluir(produto_pedidoEntity produto_pedido) {

        return produto_pedidoRepository.save(produto_pedido);
    }

    public produto_pedidoEntity editar(produtoPedidoId id, produto_pedidoEntity produto_pedido) {
        // Verifique se a produto_pedido existe
        Optional<produto_pedidoEntity> produto_pedidoExistente = produto_pedidoRepository.findById(id);

        if (produto_pedidoExistente.isPresent()) {
            // Atualiza a produto_pedido
            produto_pedidoEntity produto_pedidoAtualizada = produto_pedidoExistente.get();
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

    public List<produto_pedidoEntity> listarTodos() {
        return produto_pedidoRepository.findAll();
    }

    public void excluir(produtoPedidoId id) {
        produto_pedidoRepository.deleteById(id);
    }
}