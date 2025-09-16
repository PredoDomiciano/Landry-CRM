package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;

@Table(name = "Produto_Pedido")
@Entity
@Data
public class produto_pedidoEntities {
    @EmbeddedId
    private produtoPedidoId id;

    @ManyToOne
    @MapsId("idPedido")
    @JoinColumn(name = "id_pedido")
    private pedidosEntities pedido;

    @ManyToOne
    @MapsId("idProduto")
    @JoinColumn(name = "id_produto")
    private produtosEntities produto;

    @Column(nullable = false)
    private Integer quantidade;

    private String pedra;
    @NotNull
    private String tamanho;
    @NotNull
    private BigDecimal valor;
}
