package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Table(name = "Pedidos")
@Entity
@Data
public class pedidosEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPedido;
    @NotNull
    private LocalDate data;
    @NotNull
    private BigDecimal valorTotal;
    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    @OneToOne
    @JoinColumn(name = "id_oportunidade",unique = true)
    private oportunidadesEntities oportunidade;

    @OneToMany(mappedBy = "pedido",cascade = CascadeType.ALL)
    private List<produto_pedidoEntities> produto_pedidos;

}
