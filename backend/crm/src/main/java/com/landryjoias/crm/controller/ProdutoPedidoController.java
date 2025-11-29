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

import com.landryjoias.crm.entity.ProdutoPedidoId;
import com.landryjoias.crm.entity.ProdutoPedidoEntity;
import com.landryjoias.crm.services.ProdutoPedidoService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/produto_pedido")
public class ProdutoPedidoController {
    private final ProdutoPedidoService ProdutoPedidoService;

    @GetMapping
    public ResponseEntity<List<ProdutoPedidoEntity>> listarTodos() {
        List<ProdutoPedidoEntity> lista = ProdutoPedidoService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<ProdutoPedidoEntity> incluir(@RequestBody ProdutoPedidoEntity produto_pedido) {
        ProdutoPedidoEntity novo = ProdutoPedidoService.incluir(produto_pedido);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoPedidoEntity> editar(@PathVariable ProdutoPedidoId id,
                                                      @RequestBody ProdutoPedidoEntity produto_pedido) {
        ProdutoPedidoEntity atualizado = ProdutoPedidoService.editar(id, produto_pedido);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable ProdutoPedidoId id) {
        ProdutoPedidoService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
