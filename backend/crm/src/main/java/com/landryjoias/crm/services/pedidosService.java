package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.pedidosEntity;
import com.landryjoias.crm.repository.pedidosRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class pedidosService {
   private final pedidosRepository pedidosRepository;

   public pedidosEntity incluir(pedidosEntity pedidos) {
      return (pedidosEntity) this.pedidosRepository.save(pedidos);
   }

   public pedidosEntity editar(int id, pedidosEntity pedidos) {
      Optional<pedidosEntity> pedidosExistente = this.pedidosRepository.findById(id);
      if (pedidosExistente.isPresent()) {
         pedidosEntity pedidosAtualizada = (pedidosEntity) pedidosExistente.get();
         pedidosAtualizada.setData(pedidos.getData());
         pedidosAtualizada.setValorTotal(pedidos.getValorTotal());
         pedidosAtualizada.setStatus(pedidos.getStatus());
         return (pedidosEntity) this.pedidosRepository.save(pedidosAtualizada);
      } else {
         return null;
      }
   }

   public List<pedidosEntity> listarTodos() {
      return this.pedidosRepository.findAll();
   }

   public void excluir(Integer id) {
      this.pedidosRepository.deleteById(id);
   }
}