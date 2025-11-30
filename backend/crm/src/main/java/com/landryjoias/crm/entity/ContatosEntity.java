package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Contatos")
@Data
public class ContatosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idContato;

    private String rua;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String complemento;

    @Column(name = "numeroCasa")
    private String numeroCasa; // O primeiro "numero" do diagrama

    @Column(name = "telefone")
    private String telefone; // O segundo "numero" do diagrama

    private String email;
}