package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import jakarta.annotation.Nonnull;

@Table(name = "Pedidos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class pedidosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPedido;
    @Nonnull
    private LocalDate data;
    @Nonnull
    private Integer valorTotal;
    @Enumerated(EnumType.STRING)
    private com.landryjoias.crm.entity.StatusPedido status;
}
