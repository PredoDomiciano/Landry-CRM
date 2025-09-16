package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.util.List;

@Table(name = "Usuarios")
@Entity
@Data
public class usuarioEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idUsuario;
    @Column(nullable = false,unique = true)
    private String login;
    @Column(nullable = false)
    private String senha;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_contato", referencedColumnName = "idContato")
    private contatosEntities Contatos;
    @OneToMany(mappedBy = "usuario")
    private List<logEntities> logs;
    @OneToMany(mappedBy = "gerente")
    private List<funcionarioEntities> funcionarios;

}
