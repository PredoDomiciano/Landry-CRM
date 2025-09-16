package entities;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;

@Embeddable
@Data
public class produtoPedidoId implements Serializable {
    private Long idProduto;
    private Long idPedido;
}
