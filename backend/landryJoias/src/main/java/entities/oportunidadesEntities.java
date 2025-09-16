package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Table(name = "Oportunidades")
@Entity
@Data
public class oportunidadesEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOportunidade;
    @Column(nullable = false,name = "nome_da_oportunidade")
    private String nomeOportunidade;
    @Column(name = "valor_estimado")
    private BigDecimal valorEstimado;
    @Enumerated(EnumType.STRING)
    @Column(name = "estagio_do_funil")
    private EstagioFunil estagioFunil;
    @Column(name = "data_de_fechamento_estimada")
    private LocalDate dataDeFechamentoEstimada;

    @ManyToOne
    @JoinColumn(name = "id_cliente",nullable = false)
    private clienteEntities cliente;

    @ManyToOne
    @JoinColumn(name = "id_funcionario",nullable = false)
    private funcionarioEntities funcionario;

    @OneToOne(mappedBy = "oportunidade")
    private pedidosEntities pedidos;
}
