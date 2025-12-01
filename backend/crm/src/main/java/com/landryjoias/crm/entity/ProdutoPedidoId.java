package com.landryjoias.crm.entity;

import jakarta.persistence.Column;
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
    @Column(name = "idPedido")
    private Integer idPedido;

    @Column(name = "idProduto")
    private Integer idProduto;

}