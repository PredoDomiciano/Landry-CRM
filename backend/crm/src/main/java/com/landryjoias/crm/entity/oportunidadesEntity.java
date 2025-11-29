package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Table(name = "Oportunidades")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class oportunidadesEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idOportunidade;
    @Column(nullable = false,name = "nome da oportunidade")
    private String nomeOportunidade;
    @Column(name = "valor estimado")
    private Integer valorEstimado;
    @Enumerated(EnumType.STRING)
    @Column(name = "estagio do funil")
    private com.landryjoias.crm.entity.EstagioFunil estagioFunil;
    @Column(name = "data de fechamento estimada")
    private LocalDate dataDeFechamentoEstimada;
}
