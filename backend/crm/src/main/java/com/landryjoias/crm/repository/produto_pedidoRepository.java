package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.produto_pedidoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface produto_pedidoRepository extends JpaRepository<produto_pedidoEntity, com.landryjoias.crm.entity.produtoPedidoId> {
}
