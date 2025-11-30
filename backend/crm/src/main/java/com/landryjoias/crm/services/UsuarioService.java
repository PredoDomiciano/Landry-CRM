package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.UsuarioRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {
   private final UsuarioRepository usuarioRepository;

   public UsuarioEntity incluir(UsuarioEntity usuario) {
      return (UsuarioEntity) this.usuarioRepository.save(usuario);
   }

   public UsuarioEntity editar(int id, UsuarioEntity usuario) {
      Optional<UsuarioEntity> usuarioExistente = this.usuarioRepository.findById(id);
      if (usuarioExistente.isPresent()) {
         UsuarioEntity usuarioAtualizada = (UsuarioEntity) usuarioExistente.get();
         usuarioAtualizada.setEmail(usuario.getEmail());
         usuarioAtualizada.setSenha(usuario.getSenha());
         usuarioAtualizada.setNivelAcesso(usuario.getNivelAcesso());
         return (UsuarioEntity) this.usuarioRepository.save(usuarioAtualizada);
      } else {
         return null;
      }
   }

   public List<UsuarioEntity> listarTodos() {
      return this.usuarioRepository.findAll();
   }

   public void excluir(Integer id) {
      this.usuarioRepository.deleteById(id);
   }

}