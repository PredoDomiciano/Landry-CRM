package entities;

import lombok.Data;

@Data
public class pedidosEntities {
    private int idPedido;
    private String numero;
    private String data;
    private double valorTotal;
    private int Status;
}
