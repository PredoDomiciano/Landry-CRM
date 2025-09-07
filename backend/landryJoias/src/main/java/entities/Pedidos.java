package entities;

import lombok.Data;

@Data
public class Pedidos {
    private int idPedido;
    private String numero;
    private String data;
    private double valorTotal;
    private int Status;
}
