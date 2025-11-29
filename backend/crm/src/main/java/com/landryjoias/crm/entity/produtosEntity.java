package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.Data;
import jakarta.annotation.Nonnull;

@Table(name = "Produtos")
@Entity
@Data
public class produtosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduto;
    @Nonnull
    private String nome;
    @Nonnull
    private String descricao;
    @Nonnull
    private int tipo;
    @Nonnull
    private double tamanho;
    @Nonnull
    private float valor;
    @Nonnull
    private int quantidadeEstoque;
    @Nonnull
    private String Material;

}
