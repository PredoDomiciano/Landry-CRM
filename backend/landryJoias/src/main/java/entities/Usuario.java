package entities;

import lombok.Data;

@Data
public class Usuario {
    private int idUsuario;
    private String login;
    private String senha;
}
