package com.landryjoias.crm.entity;

import java.util.List;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Table(name = "Usuarios")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor // <--- Essencial
public class UsuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String senha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, name = "nivelAcesso")
    private nivelAcesso nivelAcesso;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "idContato")
    private ContatosEntity contato;

    @JsonIgnore
    @OneToMany(mappedBy = "usuario")
    private List<LogEntity> logs;
}