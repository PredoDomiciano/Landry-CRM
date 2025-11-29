package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.FuncionarioEntity;
import com.landryjoias.crm.repository.FuncionarioRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FuncionarioService {
   private final FuncionarioRepository funcionarioRepository;

   public FuncionarioEntity incluir(FuncionarioEntity funcionario) {
      return (FuncionarioEntity) this.funcionarioRepository.save(funcionario);
   }

   public FuncionarioEntity editar(int id, FuncionarioEntity funcionario) {
      Optional<FuncionarioEntity> funcionarioExistente = this.funcionarioRepository.findById(id);
      if (funcionarioExistente.isPresent()) {
         FuncionarioEntity funcionarioAtualizada = (FuncionarioEntity) funcionarioExistente.get();
         funcionarioAtualizada.setCpf(funcionario.getCpf());
         funcionarioAtualizada.setEmail(funcionario.getEmail());
         funcionarioAtualizada.setCargo(funcionario.getCargo());
         funcionarioAtualizada.setNome(funcionario.getNome());
         return (FuncionarioEntity) this.funcionarioRepository.save(funcionarioAtualizada);
      } else {
         return null;
      }
   }

   public List<FuncionarioEntity> listarTodos() {
      return this.funcionarioRepository.findAll();
   }

   public void excluir(Integer id) {
      this.funcionarioRepository.deleteById(id);
   }
}