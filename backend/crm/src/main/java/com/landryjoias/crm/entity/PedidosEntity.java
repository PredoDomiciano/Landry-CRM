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

    // ALTERAÇÃO 1: FetchType.EAGER obriga a trazer a oportunidade e os dados dela
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idOportunidade")
    private OportunidadesEntity oportunidade;

    // ALTERAÇÃO 2: FetchType.EAGER obriga a trazer os itens junto com o pedido
    @OneToMany(mappedBy = "pedido", fetch = FetchType.EAGER)
    private List<ProdutoPedidoEntity> itens;
}