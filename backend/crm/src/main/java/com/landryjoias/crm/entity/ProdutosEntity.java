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
    private String tipo; 
    
    // --- USO DOS ENUMS AQUI ---
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tamanho tamanho; // Usa o Enum Tamanho.java
    
    private String tamanhoPersonalizado;
    
    @Column(nullable = false)
    private float valor;
    
    @Column(nullable = false)
    private int quantidadeEstoque;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "material", nullable = false)
    private Material material; // Usa o Enum Material.java
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_pedra")
    private TipoPedra tipoPedra; // Usa o Enum TipoPedra.java
    
    @Column(name = "cor_pedra")
    private String corPedra;
}