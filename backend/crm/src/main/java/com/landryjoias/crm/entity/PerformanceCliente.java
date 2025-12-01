package com.landryjoias.crm.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Immutable
@Table(name = "vw_PerformanceClientes") // exatamente igual no banco
public class PerformanceCliente {

    @Id
    @Column(name = "ClienteID")
    private Long clienteId;

    @Column(name = "NomeCliente")
    private String nomeCliente;

    @Column(name = "EmailContato")
    private String emailContato;

    @Column(name = "Cidade")
    private String cidade;

    @Column(name = "TotalPedidos")
    private Integer totalPedidos;

    @Column(name = "TotalGasto")
    private BigDecimal totalGasto;

    @Column(name = "TicketMedio")
    private BigDecimal ticketMedio;

    @Column(name = "UltimaCompra")
    private LocalDateTime ultimaCompra;
}