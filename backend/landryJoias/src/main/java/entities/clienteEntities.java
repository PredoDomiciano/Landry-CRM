package entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
@Table (name = "Cliente")
@Entity
@Data
public class clienteEntities {
    private int idCliente;
    private String data;
    private String nomeDoComercio;
}
