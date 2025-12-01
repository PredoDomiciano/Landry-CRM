package com.landryjoias.crm.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

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
    
    @Column(name = "nomeComercio", nullable = false)
    private String nomeDoComercio;
    
    @Column(unique = true, nullable = false)
    private String email;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idUsuario")
    private UsuarioEntity usuario;
    
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idContato")
    private ContatosEntity contato;

    @JsonIgnore 
    @OneToMany(mappedBy = "cliente")
    private List<OportunidadesEntity> oportunidades;
}