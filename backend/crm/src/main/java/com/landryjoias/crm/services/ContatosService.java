package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.ContatosEntity;
import com.landryjoias.crm.repository.ContatosRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ContatosService {

    private final ContatosRepository ContatosRepository;

    public ContatosEntity incluir(ContatosEntity Contatos) {
        return ContatosRepository.save(Contatos);
    }

    public ContatosEntity editar(int id, ContatosEntity Contatos) {
        // Verifique se o Contatos existe
        Optional<ContatosEntity> ContatosExistente = ContatosRepository.findById(id);

        if (ContatosExistente.isPresent()) {
            // Atualiza o Contatos
            ContatosEntity ContatosAtualizada = ContatosExistente.get();

            // AQUI ESTAVA O ERRO: No Java, a primeira letra do campo vira MAIÚSCULA no
            // get/set
            ContatosAtualizada.setTelefone(Contatos.getTelefone()); // CNPJ geralmente fica tudo maiúsculo mesmo
            // Correções de minúsculo para Maiúsculo (CamelCase):
            ContatosAtualizada.setRua(Contatos.getRua()); // Era setrua/getrua
            ContatosAtualizada.setBairro(Contatos.getBairro()); // Era setbairro/getbairro
            ContatosAtualizada.setCidade(Contatos.getCidade()); // Era setcidade/getcidade
            ContatosAtualizada.setEstado(Contatos.getEstado()); // Era setestado/getestado
            ContatosAtualizada.setCep(Contatos.getCep()); // Era setcep/getcep
            ContatosAtualizada.setComplemento(Contatos.getComplemento());
            ContatosAtualizada.setNumeroCasa(Contatos.getNumeroCasa());
            ContatosAtualizada.setEmail(Contatos.getEmail());

            return ContatosRepository.save(ContatosAtualizada);
        } else {
            return null;
        }
    }

    public List<ContatosEntity> listarTodos() {
        return ContatosRepository.findAll();
    }

    public void excluir(Integer id) {
        ContatosRepository.deleteById(id);
    }
}