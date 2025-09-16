package entities;

import jakarta.persistence.*;
import lombok.Data;
import org.antlr.v4.runtime.misc.NotNull;

import java.time.LocalDateTime;

@Table(name = "Log")
@Entity
@Data
public class logEntities {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idLog;
    @NotNull
    @Column(name = "tipo_atividade")
    private int tipoDeAtividade;
    @NotNull
    private String assunto;
    @NotNull
    @Column(columnDefinition = "TEXT")
    private String descricao;
    @NotNull
    private LocalDateTime data;
    @Enumerated(EnumType.STRING)
    @NotNull
    private Statuslog status;
    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private usuarioEntities usuarioLog;

}
