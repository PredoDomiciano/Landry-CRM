package entities;

import lombok.Data;

@Data
public class Produtos {
    private int idProduto;
    private String nome;
    private String descricao;
    private int tipo;
    private double tamanho;
    private double preco;
}
