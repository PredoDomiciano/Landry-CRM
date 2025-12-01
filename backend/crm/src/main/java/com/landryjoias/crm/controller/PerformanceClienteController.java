package com.landryjoias.crm.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.landryjoias.crm.entity.PerformanceCliente;
import com.landryjoias.crm.repository.PerformanceClienteRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class PerformanceClienteController {

    private final PerformanceClienteRepository repository;

    @GetMapping("/performance-clientes")
    public ResponseEntity<List<PerformanceCliente>> getRelatorioGeral() {
        return ResponseEntity.ok(repository.findAll());
    }
}