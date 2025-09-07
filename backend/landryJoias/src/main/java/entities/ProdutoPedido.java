package entities;

import lombok.Data;

@Data
public class ProdutoPedido {
    private int idProduto;
    private int idPedido;
    private int quantidade;
    private String pedra;
    private double valorPedido;
}
