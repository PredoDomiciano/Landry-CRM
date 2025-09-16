package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

@Table(name = "Contatos")
@Entity
@Data
public class contatosEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idContato;
    private String endereco;
    private String numero;
    @Column(nullable = false,unique = true)
    private String email;
    @OneToOne(mappedBy = "contatos")
    private usuarioEntities usuario;


}
