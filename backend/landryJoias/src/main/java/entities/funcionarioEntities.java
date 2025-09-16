package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.List;

@Table(name = "Funcionario")
@Entity
@Data
public class funcionarioEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idFuncionario;
    @NotNull
    private String nome;
    @Column(nullable = false,unique = true)
    private String cpf;
    @ManyToOne
    @JoinColumn(name = "id_gerente")
    private usuarioEntities gerente;

    @OneToMany(mappedBy = "funcionario",cascade = CascadeType.ALL)
    private List<oportunidadesEntities> oportunidades;
}
