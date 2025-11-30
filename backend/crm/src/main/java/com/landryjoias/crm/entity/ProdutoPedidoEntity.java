package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Table(name = "Produtos_Pedidos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoPedidoEntity {
    @EmbeddedId
    private ProdutoPedidoId id;

    @JsonIgnore
    @ManyToOne
    @MapsId("idPedido")
    @JoinColumn(name = "idPedido")
    private PedidosEntity pedido;

    @ManyToOne
    @MapsId("idProduto")
    @JoinColumn(name = "idProduto")
    private ProdutosEntity produto;

    @Column(nullable = false)
    private Integer quantidade;

    private String pedra;

    @Column(nullable = false)
    private String tamanho; // @Nonnull removido

    @Column(nullable = false)
    private float valor; // @Nonnull removido
}