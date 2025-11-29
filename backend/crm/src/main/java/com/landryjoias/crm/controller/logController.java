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
import com.landryjoias.crm.entity.logEntity;
import com.landryjoias.crm.services.logService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/log")
public class logController {
    private final logService logService;

    @GetMapping
    public ResponseEntity<List<logEntity>> listarTodos() {
        List<logEntity> lista = logService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<logEntity> incluir(@RequestBody logEntity log) {
        logEntity novo = logService.incluir(log);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<logEntity> editar(@PathVariable int id,
            @RequestBody logEntity log) {
        logEntity atualizado = logService.editar(id, log);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        logService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
