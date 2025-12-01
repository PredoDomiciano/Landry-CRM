package com.landryjoias.crm.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import com.landryjoias.crm.entity.LogEntity; // Apenas para referência, não usado na query

public interface DashboardRepository extends Repository<LogEntity, Integer> {
    
    @Query(value = "SELECT * FROM vw_dashboard_resumo", nativeQuery = true)
    DashboardSummary getResumo();
}