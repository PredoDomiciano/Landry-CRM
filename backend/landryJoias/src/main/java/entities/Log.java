package entities;

import lombok.Data;

    @Data
public class Log {
    private int idLog;
    private int tipoDeAtividade;
    private String assunto;
    private String descricao;
    private String data;
    private int status;

}
