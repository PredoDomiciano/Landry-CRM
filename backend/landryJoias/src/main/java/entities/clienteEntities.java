package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDate;
import java.util.List;

@Table (name = "Cliente")
@Entity
@Data
public class clienteEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCliente;
    @NotNull
    private LocalDate data;
    @Column(name = "nome_comercio", nullable = false)
    private String nomeDoComercio;

    @OneToMany(mappedBy = "cliente",cascade = CascadeType.ALL)
    private List<oportunidadesEntities> oportunidades;
}
