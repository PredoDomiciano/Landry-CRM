package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.LogEntity;
import com.landryjoias.crm.entity.UsuarioEntity;
import com.landryjoias.crm.repository.LogRepository;
import com.landryjoias.crm.repository.UsuarioRepository; // Adicionado para buscar usuário
import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogService {

   private final LogRepository logRepository;
   private final UsuarioRepository usuarioRepository; // 1. Precisamos disso para vincular o log a quem fez

   // --- NOVO: Método Mágico para Logs Automáticos ---
   // Use este método dentro do ClienteService, PedidosService, etc.
   public void registrar(int tipoAtividade, String assunto, String descricao, String titulo, Integer idUsuario) {
      try {
         LogEntity log = new LogEntity();
         log.setTipoDeAtividade(tipoAtividade); // Ex: "VENDA"
         log.setAssunto(assunto); // Ex: "Venda #102"
         log.setDescricao(descricao); // Ex: "Venda de R$ 500 realizada"
         log.setTitulo(titulo); // Ex: "Sucesso"
         log.setData(LocalDateTime.now()); // Data automática de hoje

         // Se tiver um ID de usuário, busca e vincula
         if (idUsuario != null) {
            Optional<UsuarioEntity> usuario = usuarioRepository.findById(idUsuario);
            if (usuario.isPresent()) {
               log.setUsuario(usuario.get());
            }
         }

         logRepository.save(log);
      } catch (Exception e) {
         // Log nunca deve travar o sistema, então só avisamos no console se falhar
         System.err.println("Erro ao criar log automático: " + e.getMessage());
      }
   }

   // --- MÉTODOS CRUD (Mantidos e Melhorados) ---

   public LogEntity incluir(LogEntity log) {
      // Garante a data atual se não vier preenchida
      if (log.getData() == null) {
         log.setData(LocalDateTime.now());
      }
      return logRepository.save(log);
   }

   public LogEntity editar(Integer id, LogEntity log) { // Mudei int para Integer (padrão)
      Optional<LogEntity> logExistente = logRepository.findById(id);

      if (logExistente.isPresent()) {
         LogEntity logAtualizada = logExistente.get();

         // Atualiza apenas os campos editáveis
         logAtualizada.setTitulo(log.getTitulo());
         logAtualizada.setDescricao(log.getDescricao());
         logAtualizada.setAssunto(log.getAssunto());
         logAtualizada.setTipoDeAtividade(log.getTipoDeAtividade());
         // Nota: Geralmente não mudamos a Data de um log histórico, então removi o
         // setData aqui.

         return logRepository.save(logAtualizada);
      } else {
         return null;
      }
   }

   public List<LogEntity> listarTodos() {
      return logRepository.findAll();
   }

   public void excluir(Integer id) {
      logRepository.deleteById(id);
   }
}