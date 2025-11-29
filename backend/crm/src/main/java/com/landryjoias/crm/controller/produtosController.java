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
import com.landryjoias.crm.entity.produtosEntity;
import com.landryjoias.crm.services.produtosService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/produtos")
public class produtosController {
    private final produtosService produtosService;

    @GetMapping
    public ResponseEntity<List<produtosEntity>> listarTodos() {
        List<produtosEntity> lista = produtosService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<produtosEntity> incluir(@RequestBody produtosEntity produtos) {
        produtosEntity novo = produtosService.incluir(produtos);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<produtosEntity> editar(@PathVariable int id,
            @RequestBody produtosEntity produtos) {
        produtosEntity atualizado = produtosService.editar(id, produtos);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        produtosService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
