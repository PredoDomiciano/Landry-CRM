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
public class FuncionarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idFuncionario;

    @Nonnull
    private String nome;

    @Column(nullable = false, unique = true)
    private String cpf;

    // Aqui definimos a profissão dele na joalheria
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Cargo cargo;

    @Column(nullable = false)
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idUsuario", referencedColumnName = "idUsuario")
    private UsuarioEntity usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idContato")
    private ContatosEntity contato;
}