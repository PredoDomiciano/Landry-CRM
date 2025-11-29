package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.annotation.Nonnull;

@Table(name = "Funcionarios")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class funcionarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFuncionario;
    @Nonnull
    private String nome;
    @Column(nullable = false, unique = true)
    private String cpf;
    @Column(nullable = false)
    private String cargo;
    @Column(nullable = false)
    private String email;
}
