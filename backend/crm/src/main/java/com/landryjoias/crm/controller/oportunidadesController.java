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
import com.landryjoias.crm.entity.oportunidadesEntity;
import com.landryjoias.crm.services.oportunidadesService;

@RestController
@RequiredArgsConstructor // colocando isso não precisa colocar @Autowired no atributo
@RequestMapping(value = "/oportunidades")
public class oportunidadesController {
    private final oportunidadesService oportunidadesService;

    @GetMapping
    public ResponseEntity<List<oportunidadesEntity>> listarTodos() {
        List<oportunidadesEntity> lista = oportunidadesService.listarTodos();
        return ResponseEntity.ok().body(lista);
    }

    @PostMapping
    public ResponseEntity<oportunidadesEntity> incluir(@RequestBody oportunidadesEntity oportunidades) {
        oportunidadesEntity novo = oportunidadesService.incluir(oportunidades);
        if (novo != null) {
            return new ResponseEntity<>(novo, HttpStatus.CREATED);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<oportunidadesEntity> editar(@PathVariable int id,
            @RequestBody oportunidadesEntity oportunidades) {
        oportunidadesEntity atualizado = oportunidadesService.editar(id, oportunidades);
        if (atualizado != null) {
            return new ResponseEntity<>(atualizado, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable int id) {
        oportunidadesService.excluir(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
