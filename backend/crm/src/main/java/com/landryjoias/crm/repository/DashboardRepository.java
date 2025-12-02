package com.landryjoias.crm.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import com.landryjoias.crm.entity.LogEntity;
import java.util.List; // Importante adicionar esta importação

public interface DashboardRepository extends Repository<LogEntity, Integer> {
    
    @Query(value = "SELECT * FROM vw_dashboard_resumo", nativeQuery = true)
    DashboardSummary getResumo();

    // --- NOVA QUERY PARA O GRÁFICO (SQL SERVER) ---
    // Agrupa as vendas por mês e soma os valores
    @Query(value = "SELECT FORMAT(data, 'yyyy-MM') as mes, SUM(valor_total) as valor " +
                   "FROM pedidos " +
                   "WHERE status <> 'CANCELADO' " +
                   "GROUP BY FORMAT(data, 'yyyy-MM') " +
                   "ORDER BY mes ASC", nativeQuery = true)
    List<DashboardChartData> getDadosGrafico();
}