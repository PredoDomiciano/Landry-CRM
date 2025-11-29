package com.landryjoias.crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;

import com.landryjoias.crm.entity.produtoPedidoId;
import com.landryjoias.crm.entity.produto_pedidoEntity;
import com.landryjoias.crm.services.produto_pedidoService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/produto_pedido")
public class produto_pedidoController {
    private final produto_pedidoService produto_pedidoService;

    @GetMapping
    public ResponseEntity<List<produto_pedidoEntity>> listarTodos() {
        List<produto_pedidoEntity> lista = produto_pedidoService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<produto_pedidoEntity> incluir(@RequestBody produto_pedidoEntity produto_pedido) {
        produto_pedidoEntity novo = produto_pedidoService.incluir(produto_pedido);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<produto_pedidoEntity> editar(@PathVariable produtoPedidoId id,
            @RequestBody produto_pedidoEntity produto_pedido) {
        produto_pedidoEntity atualizado = produto_pedidoService.editar(id, produto_pedido);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable produtoPedidoId id) {
        produto_pedidoService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
