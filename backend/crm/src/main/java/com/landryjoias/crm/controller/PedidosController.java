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
import com.landryjoias.crm.entity.PedidosEntity;
import com.landryjoias.crm.services.PedidosService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/pedidos")
public class PedidosController {
    private final PedidosService pedidosService;

    @GetMapping
    public ResponseEntity<List<PedidosEntity>> listarTodos() {
        List<PedidosEntity> lista = pedidosService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<PedidosEntity> incluir(@RequestBody PedidosEntity pedidos) {
        
        PedidosEntity novo = pedidosService.incluir(pedidos);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
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
