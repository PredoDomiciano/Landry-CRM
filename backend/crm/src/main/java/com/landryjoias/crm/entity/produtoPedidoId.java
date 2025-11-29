package com.landryjoias.crm.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class produtoPedidoId implements Serializable {
    private int idProduto;
    private int idPedido;
}
