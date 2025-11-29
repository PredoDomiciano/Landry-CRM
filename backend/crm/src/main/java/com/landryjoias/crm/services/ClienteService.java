package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.ClienteEntity;
import com.landryjoias.crm.repository.ClienteRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteEntity incluir(ClienteEntity cliente) {
        return clienteRepository.save(cliente);
    }

    public ClienteEntity editar(int id, ClienteEntity cliente) {
        // Verifique se o cliente existe
        Optional<ClienteEntity> clienteExistente = clienteRepository.findById(id);

        if (clienteExistente.isPresent()) {
            // Atualiza o cliente
            ClienteEntity clienteAtualizada = clienteExistente.get();

            // AQUI ESTAVA O ERRO: No Java, a primeira letra do campo vira MAIÚSCULA no
            // get/set
            clienteAtualizada.setNomeDoComercio(cliente.getNomeDoComercio());
            clienteAtualizada.setCNPJ(cliente.getCNPJ()); // CNPJ geralmente fica tudo maiúsculo mesmo

            // Correções de minúsculo para Maiúsculo (CamelCase):
            // Era setcep/getcep


            clienteAtualizada.setEmail(cliente.getEmail());

            return clienteRepository.save(clienteAtualizada);
        } else {
            return null;
        }
    }

    public List<ClienteEntity> listarTodos() {
        return clienteRepository.findAll();
    }

    public void excluir(Integer id) {
        clienteRepository.deleteById(id);
    }
}