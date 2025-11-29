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
import com.landryjoias.crm.entity.ContatosEntity;
import com.landryjoias.crm.services.ContatosService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/Contatos")
public class ContatosController {
    private final ContatosService ContatosService;

    @GetMapping
    public ResponseEntity<List<ContatosEntity>> listarTodos() {
        List<ContatosEntity> lista = ContatosService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<ContatosEntity> incluir(@RequestBody ContatosEntity Contatos) {
        ContatosEntity novo = ContatosService.incluir(Contatos);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContatosEntity> editar(@PathVariable int id,
            @RequestBody ContatosEntity Contatos) {
        ContatosEntity atualizado = ContatosService.editar(id, Contatos);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        ContatosService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
