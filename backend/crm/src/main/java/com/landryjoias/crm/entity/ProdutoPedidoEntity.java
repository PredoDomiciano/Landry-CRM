package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.annotation.Nonnull;

@Table(name = "Produtos_Pedidos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoPedidoEntity {
    @EmbeddedId
    private ProdutoPedidoId id;

    @ManyToOne
    @MapsId("idPedido")
    @JoinColumn(name = "id_pedido")
    private PedidosEntity pedido;

    @ManyToOne
    @MapsId("idProduto")
    @JoinColumn(name = "id_produto")
    private ProdutosEntity produto;

    @Column(nullable = false)
    private Integer quantidade;

    private String pedra;
    @Nonnull
    private String tamanho;
    @Nonnull
    private float valor;

}
