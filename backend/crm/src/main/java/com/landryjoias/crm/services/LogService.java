package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.repository.LogRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {
   private final LogRepository logRepository;

   public LogEntity incluir(LogEntity log) {
      return (LogEntity) this.logRepository.save(log);
   }

   public LogEntity editar(int id, LogEntity log) {
      Optional<LogEntity> logExistente = this.logRepository.findById(id);
      if (logExistente.isPresent()) {
         LogEntity logAtualizada = (LogEntity) logExistente.get();
         logAtualizada.setTitulo(log.getTitulo());
         logAtualizada.setDescricao(log.getDescricao());
         logAtualizada.setAssunto(log.getAssunto());
         logAtualizada.setTipoDeAtividade(log.getTipoDeAtividade());
         logAtualizada.setData(log.getData());
         return (LogEntity) this.logRepository.save(logAtualizada);
      } else {
         return null;
      }
   }

   public List<LogEntity> listarTodos() {
      return this.logRepository.findAll();
   }

   public void excluir(Integer id) {
      this.logRepository.deleteById(id);
   }
}