package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.Data;

@Table(name = "Usuarios")
@Entity
@Data
public class usuarioEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idUsuario;
    @Column(nullable = false, unique = true)
    private String login;
    @Column(nullable = false)
    private String senha;
    // FAZER CRIPTOGRAFIA DA SENHA SE SOBRAR TEMPO
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private nivelAcesso nivelAcesso;
}
