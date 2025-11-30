package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Table(name = "Oportunidades")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class OportunidadesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idOportunidade;
    @Column(nullable = false, name = "nomedaOportunidade")
    private String nomeOportunidade;
    @Column(name = "valorEstimado")
    private Integer valorEstimado;
    @Enumerated(EnumType.STRING)
    @Column(name = "estagiodoFunil")
    private com.landryjoias.crm.entity.EstagioFunil estagioFunil;
    @Column(name = "datadeFechamentoEstimada")
    private LocalDate dataDeFechamentoEstimada;

    @JsonIgnoreProperties({ "oportunidades", "usuario" })
    @ManyToOne
    @JoinColumn(name = "idCliente")
    private ClienteEntity cliente;

    // Uma oportunidade vira UM pedido
    @JsonIgnore
    @OneToOne(mappedBy = "oportunidade")
    private PedidosEntity pedido;

}
