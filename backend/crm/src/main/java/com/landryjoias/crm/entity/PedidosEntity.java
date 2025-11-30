package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.util.List;

import jakarta.annotation.Nonnull;

@Table(name = "Pedidos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PedidosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPedido;
    @Nonnull
    private LocalDate data;
    @Nonnull
    private Integer valorTotal;
    @Enumerated(EnumType.STRING)
    private com.landryjoias.crm.entity.StatusPedido status;

    @OneToOne
    @JoinColumn(name = "idOportunidade")
    private OportunidadesEntity oportunidade;

    // Relacionamento complexo com Produtos (veja abaixo)
    @OneToMany(mappedBy = "pedido")
    private List<ProdutoPedidoEntity> itens;
}
