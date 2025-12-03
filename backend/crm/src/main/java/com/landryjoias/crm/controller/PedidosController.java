package com.landryjoias.crm.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.landryjoias.crm.dto.PedidoDTO;
import com.landryjoias.crm.entity.PedidosEntity;
import com.landryjoias.crm.entity.ProdutoPedidoEntity; // Nome Singular (conforme sua classe)
import com.landryjoias.crm.entity.ProdutoPedidoId;     // A Classe ID que você mandou agora
import com.landryjoias.crm.services.PedidosService;
import com.landryjoias.crm.repository.PedidosRepository;
import com.landryjoias.crm.repository.Produto_pedidoRepository;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/pedidos")
public class PedidosController {
    
    private final PedidosService pedidosService;
    private final Produto_pedidoRepository itensRepository;
    private final PedidosRepository pedidosRepository;
    @GetMapping
    public ResponseEntity<List<PedidosEntity>> listarTodos() {
        return ResponseEntity.ok(pedidosService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<Object> incluir(@RequestBody PedidoDTO pedidoDto) {
        try {
            return new ResponseEntity<>(pedidosService.incluir(pedidoDto), HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao salvar: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidosEntity> editar(@PathVariable int id, @RequestBody PedidosEntity pedidos) {
        PedidosEntity atualizado = pedidosService.editar(id, pedidos);
        return atualizado != null ? ResponseEntity.ok(atualizado) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        pedidosService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // ========================================================================
    // TESTE DA TRIGGER 1: Segurança (Compliance)
    // ========================================================================
    @PostMapping("/{id}/itens")
    public ResponseEntity<Object> adicionarItem(@PathVariable Integer id, @RequestBody ProdutoPedidoEntity item) {
        try {
            // 1. Criar e Associar o Pedido (Pois o @JsonIgnore escondeu ele)
            PedidosEntity pedidoRef = new PedidosEntity();
            pedidoRef.setIdPedido(id);
            item.setPedido(pedidoRef);

            // 2. CORREÇÃO DO ERRO NULL POINTER: Instanciar a Chave Composta Manualmente
            ProdutoPedidoId pk = new ProdutoPedidoId();
            pk.setIdPedido(id);
            // Cuidado: Garanta que item.getProduto() não é null vindo do JSON
            if (item.getProduto() != null) {
                pk.setIdProduto(item.getProduto().getIdProduto());
            }
            item.setId(pk); // <--- AQUI ESTAVA FALTANDO! Agora o ID existe.

            // 3. Salvar (Trigger do SQL vai validar se pode ou não)
            ProdutoPedidoEntity salvo = itensRepository.save(item);
            return ResponseEntity.ok(salvo);

        } catch (Exception e) {
            // Extrai a mensagem de erro do SQL Server (Trigger)
            String erro = e.getMessage();
            if (e.getCause() != null && e.getCause().getCause() != null) {
                erro = e.getCause().getCause().getMessage();
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ERRO DO BANCO: " + erro);
        }
        
    }
    @PostMapping("/{id}/adicionar-procedure")
    public ResponseEntity<String> adicionarItemProcedure(
            @PathVariable Integer id, 
            @RequestBody java.util.Map<String, Integer> dados) {

        try {
            Integer idProduto = dados.get("idProduto");
            Integer quantidade = dados.get("quantidade");

            // Chama o método do Repository que roda o EXEC SQL
            pedidosRepository.adicionarItemViaProcedure(id, idProduto, quantidade);

            return ResponseEntity.ok("Sucesso! Item adicionado, estoque baixado e total atualizado via Procedure.");

        } catch (Exception e) {
            // Se o estoque for insuficiente, o SQL lança erro e cai aqui
            String erro = e.getMessage();
            if (e.getCause() != null && e.getCause().getCause() != null) {
                erro = e.getCause().getCause().getMessage();
            }
            return ResponseEntity.badRequest().body("ERRO PROCEDURE: " + erro);
        }
    }
}
