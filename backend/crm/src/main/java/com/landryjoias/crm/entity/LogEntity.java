package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.annotation.Nonnull;

import java.time.LocalDateTime;

@Table(name = "Logs")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LogEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLog;
    @Nonnull
    private String titulo;
    @Nonnull
    @Column(name = "tipo_atividade")
    private int tipoDeAtividade;
    @Nonnull
    private String assunto;
    @Nonnull
    @Column(columnDefinition = "TEXT")
    private String descricao;
    @Nonnull
    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private UsuarioEntity usuario;

}
