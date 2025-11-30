package com.landryjoias.crm.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Table(name = "Produtos")
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProdutosEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idProduto;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descricao;

    @Column(nullable = false)
    private int tipo;

    @Column(nullable = false)
    private double tamanho;

    @Column(nullable = false)
    private float valor;

    @Column(nullable = false)
    private int quantidadeEstoque;

    @Column(name = "Material", nullable = false)
    private String material; // @Nonnull removido!
}