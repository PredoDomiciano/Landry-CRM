package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.PedidosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface PedidosRepository extends JpaRepository<PedidosEntity, Integer> {

    // --- CHAMADA DA STORED PROCEDURE ---
    @Modifying // Diz ao Spring que isso vai alterar dados (Insert/Update)
    @Transactional // Garante a transação do lado do Java
    @Query(value = "EXEC sp_AdicionarItemPedido :pedidoId, :produtoId, :quantidade", nativeQuery = true)
    void adicionarItemViaProcedure(
            @Param("pedidoId") Integer pedidoId, 
            @Param("produtoId") Integer produtoId, 
            @Param("quantidade") Integer quantidade
    );
}