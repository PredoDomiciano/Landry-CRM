package com.landryjoias.crm.controller;

import com.landryjoias.crm.repository.DashboardChartData; // Importe a nova interface
import com.landryjoias.crm.repository.DashboardRepository;
import com.landryjoias.crm.repository.DashboardSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardRepository dashboardRepository;

    @GetMapping("/resumo")
    public ResponseEntity<Map<String, Object>> getResumo() {
        DashboardSummary resumo = dashboardRepository.getResumo();
        
        Map<String, Object> response = new HashMap<>();
        
        if (resumo != null) {
            response.put("totalClientes", resumo.getTotalClientes());
            response.put("receitaTotal", resumo.getReceitaTotal());
            response.put("pedidosPendentes", resumo.getPedidosPendentes());
            response.put("oportunidadesAbertas", resumo.getOportunidadesAbertas());
            response.put("estoqueBaixo", resumo.getEstoqueBaixo());
        } else {
            response.put("totalClientes", 0);
            response.put("receitaTotal", 0);
            response.put("pedidosPendentes", 0);
            response.put("oportunidadesAbertas", 0);
            response.put("estoqueBaixo", 0);
        }

        return ResponseEntity.ok(response);
    }

    // --- NOVO ENDPOINT QUE VAI ALIMENTAR O GRÁFICO ---
    @GetMapping("/grafico")
    public ResponseEntity<List<DashboardChartData>> getGrafico() {
        List<DashboardChartData> dados = dashboardRepository.getDadosGrafico();
        return ResponseEntity.ok(dados);
    }
}