package com.landryjoias.crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

// IMPORTANTE: Importar o DTO
import com.landryjoias.crm.dto.PedidoDTO;
import com.landryjoias.crm.entity.PedidosEntity;
import com.landryjoias.crm.services.PedidosService;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/pedidos")
public class PedidosController {
    private final PedidosService pedidosService;

    @GetMapping
    public ResponseEntity<List<PedidosEntity>> listarTodos() {
        List<PedidosEntity> lista = pedidosService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    // CORREÇÃO AQUI: Recebe o DTO (JSON simples do front) em vez da Entidade
    public ResponseEntity<PedidosEntity> incluir(@RequestBody PedidoDTO pedidoDto) {
        
        try {
            PedidosEntity novo = pedidosService.incluir(pedidoDto);
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } catch (Exception e) {
            // Se der erro (ex: sem estoque), devolve erro 400 com a mensagem
            System.err.println("Erro ao salvar pedido: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
    }

    @PutMapping("/{id}")
    public ResponseEntity<PedidosEntity> editar(@PathVariable int id,
                                                @RequestBody PedidosEntity pedidos) {
        PedidosEntity atualizado = pedidosService.editar(id, pedidos);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        pedidosService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}