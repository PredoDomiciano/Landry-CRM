package com.landryjoias.crm.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.landryjoias.crm.entity.PedidosEntity;

import jakarta.transaction.Transactional;

@Repository
public interface PedidosRepository extends JpaRepository<PedidosEntity, Integer> {

    @Modifying
    @Transactional
    @Query(value = "EXEC sp_AdicionarItemPedido :pedidoId, :produtoId, :quantidade", nativeQuery = true)
    void adicionarItemAoPedido(Integer pedidoId, Integer produtoId, Integer quantidade);
}
