package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.funcionarioEntity;
import com.landryjoias.crm.repository.funcionarioRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class funcionarioService {
   private final funcionarioRepository funcionarioRepository;

   public funcionarioEntity incluir(funcionarioEntity funcionario) {
      return (funcionarioEntity) this.funcionarioRepository.save(funcionario);
   }

   public funcionarioEntity editar(int id, funcionarioEntity funcionario) {
      Optional<funcionarioEntity> funcionarioExistente = this.funcionarioRepository.findById(id);
      if (funcionarioExistente.isPresent()) {
         funcionarioEntity funcionarioAtualizada = (funcionarioEntity) funcionarioExistente.get();
         funcionarioAtualizada.setCpf(funcionario.getCpf());
         funcionarioAtualizada.setEmail(funcionario.getEmail());
         funcionarioAtualizada.setCargo(funcionario.getCargo());
         funcionarioAtualizada.setNome(funcionario.getNome());
         return (funcionarioEntity) this.funcionarioRepository.save(funcionarioAtualizada);
      } else {
         return null;
      }
   }

   public List<funcionarioEntity> listarTodos() {
      return this.funcionarioRepository.findAll();
   }

   public void excluir(Integer id) {
      this.funcionarioRepository.deleteById(id);
   }
}