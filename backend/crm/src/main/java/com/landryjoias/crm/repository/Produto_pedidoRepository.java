package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.ProdutoPedidoEntity;
import com.landryjoias.crm.entity.ProdutoPedidoId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Produto_pedidoRepository extends JpaRepository<ProdutoPedidoEntity, ProdutoPedidoId> {
}
