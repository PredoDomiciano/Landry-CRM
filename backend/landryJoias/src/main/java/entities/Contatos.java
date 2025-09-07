package entities;

import lombok.Data;

@Data
public class Contatos {
    private int idContato;
    private String endereco;
    private String numero;
    private String email;

}
