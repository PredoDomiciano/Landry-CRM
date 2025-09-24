package controller;
import entities.clienteEntities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import services.clienteServices;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/clientes")
public class clienteController {
@Autowired
    private clienteServices clienteServices;

@PostMapping
    public ResponseEntity<clienteEntities> criarCliente(@RequestBody clienteEntities cliente){
    clienteEntities novoCliente = clienteServices.salvar(cliente);
    return new ResponseEntity<>(novoCliente, HttpStatus.CREATED);
}
}
