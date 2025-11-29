package com.landryjoias.crm.entity;

import java.util.List;

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
    // Relacionamento 1:1 com Contatos (Usuario TEM UM contato)
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_contato")
    private ContatosEntity contato;

    // Relacionamento 1:N com Logs (Um usuário gera VÁRIOS logs)
    // O 'mappedBy' diz que quem manda na relação é a classe LogEntity
    @OneToMany(mappedBy = "usuario")
    private List<logEntity> logs;
}
