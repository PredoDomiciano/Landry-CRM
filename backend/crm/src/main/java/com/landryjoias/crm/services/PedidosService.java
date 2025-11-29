package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.PedidosEntity;
import com.landryjoias.crm.repository.PedidosRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PedidosService {
   private final PedidosRepository pedidosRepository;

   public PedidosEntity incluir(PedidosEntity pedidos) {
      return (PedidosEntity) this.pedidosRepository.save(pedidos);
   }

   public PedidosEntity editar(int id, PedidosEntity pedidos) {
      Optional<PedidosEntity> pedidosExistente = this.pedidosRepository.findById(id);
      if (pedidosExistente.isPresent()) {
         PedidosEntity pedidosAtualizada = (PedidosEntity) pedidosExistente.get();
         pedidosAtualizada.setData(pedidos.getData());
         pedidosAtualizada.setValorTotal(pedidos.getValorTotal());
         pedidosAtualizada.setStatus(pedidos.getStatus());
         return (PedidosEntity) this.pedidosRepository.save(pedidosAtualizada);
      } else {
         return null;
      }
   }

   public List<PedidosEntity> listarTodos() {
      return this.pedidosRepository.findAll();
   }

   public void excluir(Integer id) {
      this.pedidosRepository.deleteById(id);
   }
}