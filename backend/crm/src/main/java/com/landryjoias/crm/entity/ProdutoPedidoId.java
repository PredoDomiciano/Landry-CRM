package com.landryjoias.crm.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoPedidoId implements Serializable {
    private Integer idProduto;
    private Integer idPedido;
}
