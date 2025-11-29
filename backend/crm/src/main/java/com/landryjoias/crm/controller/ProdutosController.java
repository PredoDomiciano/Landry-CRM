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
import com.landryjoias.crm.entity.ProdutosEntity;
import com.landryjoias.crm.services.ProdutosService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/produtos")
public class ProdutosController {
    private final ProdutosService produtosService;

    @GetMapping
    public ResponseEntity<List<ProdutosEntity>> listarTodos() {
        List<ProdutosEntity> lista = produtosService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<ProdutosEntity> incluir(@RequestBody ProdutosEntity produtos) {
        ProdutosEntity novo = produtosService.incluir(produtos);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutosEntity> editar(@PathVariable int id,
                                                 @RequestBody ProdutosEntity produtos) {
        ProdutosEntity atualizado = produtosService.editar(id, produtos);
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
