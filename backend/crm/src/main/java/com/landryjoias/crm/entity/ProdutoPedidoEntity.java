package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Produtos_Pedidos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProdutoPedidoEntity {

    @EmbeddedId
    private ProdutoPedidoId id;

    @ManyToOne
    @MapsId("idPedido") // pega o id da PK composta
    @JoinColumn(name = "idPedido", nullable = false)
    private PedidosEntity pedido;

    @ManyToOne
    @MapsId("idProduto")
    @JoinColumn(name = "idProduto", nullable = false)
    private ProdutosEntity produto;

    @Column(nullable = false)
    private Integer quantidade;

    private String pedra;

    @Enumerated(EnumType.STRING)
    private Tamanho tamanho;

    @Column(name = "tamanho_personalizado")
    private String tamanhoPersonalizado;

    @Column(nullable = false)
    private float valor;
}


