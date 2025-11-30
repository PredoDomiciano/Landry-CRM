package com.landryjoias.crm.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
public class ClienteEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCliente;
    @Column(unique = true, nullable = false)
    private String CNPJ;
    @Column(name = "nomeComercio", nullable = false, unique = true)
    private String nomeDoComercio;
    @Column(unique = true, nullable = false)
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idUsuario")
    private UsuarioEntity usuario;

    // Um cliente tem VÁRIAS oportunidades
    @JsonIgnore
    @OneToMany(mappedBy = "cliente")
    private List<OportunidadesEntity> oportunidades;
}
