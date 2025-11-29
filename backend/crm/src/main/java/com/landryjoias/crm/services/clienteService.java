package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.clienteEntity;
import com.landryjoias.crm.repository.clienteRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class clienteService {

    private final clienteRepository clienteRepository;

    public clienteEntity incluir(clienteEntity cliente) {
        return clienteRepository.save(cliente);
    }

    public clienteEntity editar(int id, clienteEntity cliente) {
        // Verifique se o cliente existe
        Optional<clienteEntity> clienteExistente = clienteRepository.findById(id);

        if (clienteExistente.isPresent()) {
            // Atualiza o cliente
            clienteEntity clienteAtualizada = clienteExistente.get();

            // AQUI ESTAVA O ERRO: No Java, a primeira letra do campo vira MAIÚSCULA no
            // get/set
            clienteAtualizada.setNomeDoComercio(cliente.getNomeDoComercio());
            clienteAtualizada.setCNPJ(cliente.getCNPJ()); // CNPJ geralmente fica tudo maiúsculo mesmo

            // Correções de minúsculo para Maiúsculo (CamelCase):
            clienteAtualizada.setRua(cliente.getRua()); // Era setrua/getrua
            clienteAtualizada.setBairro(cliente.getBairro()); // Era setbairro/getbairro
            clienteAtualizada.setCidade(cliente.getCidade()); // Era setcidade/getcidade
            clienteAtualizada.setEstado(cliente.getEstado()); // Era setestado/getestado
            clienteAtualizada.setCep(cliente.getCep()); // Era setcep/getcep

            clienteAtualizada.setComplemento(cliente.getComplemento());
            clienteAtualizada.setNumero(cliente.getNumero());
            clienteAtualizada.setEmail(cliente.getEmail());

            return clienteRepository.save(clienteAtualizada);
        } else {
            return null;
        }
    }

    public List<clienteEntity> listarTodos() {
        return clienteRepository.findAll();
    }

    public void excluir(Integer id) {
        clienteRepository.deleteById(id);
    }
}