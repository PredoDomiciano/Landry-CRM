package entities;

import lombok.Data;

@Data
public class oportunidadesEntities {
    private int idOportunidade;
    private String nomeOportunidade;
    private double valorEstimado;
    private int estagioDoFunil;
    private String dataDeFechamentoEstimada;
}
