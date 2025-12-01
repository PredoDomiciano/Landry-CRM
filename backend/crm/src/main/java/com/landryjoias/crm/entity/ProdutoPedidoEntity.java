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
    @MapsId("idPedido") // Referencia o atributo Java 'idPedido' da classe ID
    @JoinColumn(name = "id_pedido") // TEM QUE SER IGUAL ao @Column do ID
    private PedidosEntity pedido;

    @ManyToOne
    @MapsId("idProduto") // Referencia o atributo Java 'idProduto' da classe ID
    @JoinColumn(name = "id_produto") // TEM QUE SER IGUAL ao @Column do ID
    private ProdutosEntity produto;

    @Column(nullable = false)
    private Integer quantidade;

    private String pedra;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tamanho tamanho;

    @Column(name = "tamanho_personalizado")
    private String tamanhoPersonalizado;

    @Column(nullable = false)
    private float valor;
}