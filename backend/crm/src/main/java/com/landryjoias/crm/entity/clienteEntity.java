package com.landryjoias.crm.entity;

import java.util.List;

import jakarta.annotation.Nonnull;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "Clientes")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class clienteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCliente;
    @Column(unique = true, nullable = false)
    private String CNPJ;
    @Column(name = "nome_comercio", nullable = false, unique = true)
    private String nomeDoComercio;
    @Nonnull
    private String rua;
    @Nonnull
    private String bairro;
    @Nonnull
    private String cidade;
    @Nonnull
    private String estado;
    @Nonnull
    private String cep;
    private String complemento;
    @Nonnull
    private String numero;
    @Column(unique = true, nullable = false)
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_usuario")
    private usuarioEntity usuario;

    // Um cliente tem VÁRIAS oportunidades
    @OneToMany(mappedBy = "cliente")
    private List<oportunidadesEntity> oportunidades;
}
