package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.logEntity;
import com.landryjoias.crm.repository.logRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class logService {
   private final logRepository logRepository;

   public logEntity incluir(logEntity log) {
      return (logEntity) this.logRepository.save(log);
   }

   public logEntity editar(int id, logEntity log) {
      Optional<logEntity> logExistente = this.logRepository.findById(id);
      if (logExistente.isPresent()) {
         logEntity logAtualizada = (logEntity) logExistente.get();
         logAtualizada.setTitulo(log.getTitulo());
         logAtualizada.setDescricao(log.getDescricao());
         logAtualizada.setAssunto(log.getAssunto());
         logAtualizada.setTipoDeAtividade(log.getTipoDeAtividade());
         logAtualizada.setData(log.getData());
         return (logEntity) this.logRepository.save(logAtualizada);
      } else {
         return null;
      }
   }

   public List<logEntity> listarTodos() {
      return this.logRepository.findAll();
   }

   public void excluir(Integer id) {
      this.logRepository.deleteById(id);
   }
}