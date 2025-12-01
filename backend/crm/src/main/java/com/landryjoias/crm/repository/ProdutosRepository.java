package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.ProdutosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ProdutosRepository extends JpaRepository<ProdutosEntity, Integer> {

    // Chamada da FUNCTION SQL (Table-Valued Function)
    // Retornamos um Map para ser genérico, mas poderia ser mapeado para um DTO
    @Query(value = "SELECT * FROM fn_BuscarProdutosPorFaixaPreco(:min, :max)", nativeQuery = true)
    List<Map<String, Object>> buscarPorFaixaDePreco(@Param("min") BigDecimal min, @Param("max") BigDecimal max);
}