package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;
import java.util.List;

@Table(name = "Produtos")
@Entity
@Data
public class produtosEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProduto;
    @NotNull
    private String nome;
    @NotNull
    private String descricao;
    @NotNull
    private int tipo;
    @NotNull
    private double tamanho;
    @NotNull
    private BigDecimal valor;

    @OneToMany(mappedBy = "produto")
    private List<produto_pedidoEntities> pedidos;
}
