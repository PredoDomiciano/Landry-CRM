package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.usuarioEntity;
import com.landryjoias.crm.repository.usuarioRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class usuarioService {
   private final usuarioRepository usuarioRepository;

   public usuarioEntity incluir(usuarioEntity usuario) {
      return (usuarioEntity) this.usuarioRepository.save(usuario);
   }

   public usuarioEntity editar(int id, usuarioEntity usuario) {
      Optional<usuarioEntity> usuarioExistente = this.usuarioRepository.findById(id);
      if (usuarioExistente.isPresent()) {
         usuarioEntity usuarioAtualizada = (usuarioEntity) usuarioExistente.get();
         usuarioAtualizada.setLogin(usuario.getLogin());
         usuarioAtualizada.setSenha(usuario.getSenha());
         usuarioAtualizada.setNivelAcesso(usuario.getNivelAcesso());
         return (usuarioEntity) this.usuarioRepository.save(usuarioAtualizada);
      } else {
         return null;
      }
   }

   public List<usuarioEntity> listarTodos() {
      return this.usuarioRepository.findAll();
   }

   public void excluir(Integer id) {
      this.usuarioRepository.deleteById(id);
   }

}