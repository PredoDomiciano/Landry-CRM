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
import com.landryjoias.crm.entity.pedidosEntity;
import com.landryjoias.crm.services.pedidosService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/pedidos")
public class pedidosController {
    private final pedidosService pedidosService;

    @GetMapping
    public ResponseEntity<List<pedidosEntity>> listarTodos() {
        List<pedidosEntity> lista = pedidosService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<pedidosEntity> incluir(@RequestBody pedidosEntity pedidos) {
        pedidosEntity novo = pedidosService.incluir(pedidos);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<pedidosEntity> editar(@PathVariable int id,
            @RequestBody pedidosEntity pedidos) {
        pedidosEntity atualizado = pedidosService.editar(id, pedidos);
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
