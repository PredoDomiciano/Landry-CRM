package com.landryjoias.crm.repository;
public interface DashboardSummary {
    long getTotalClientes();
    double getReceitaTotal();
    long getPedidosPendentes();
    long getOportunidadesAbertas();
    long getEstoqueBaixo();
}