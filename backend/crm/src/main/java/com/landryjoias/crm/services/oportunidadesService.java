package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.oportunidadesEntity;
import com.landryjoias.crm.repository.oportunidadesRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class oportunidadesService {
   private final oportunidadesRepository oportunidadesRepository;

   public oportunidadesEntity incluir(oportunidadesEntity oportunidades) {
      return (oportunidadesEntity) this.oportunidadesRepository.save(oportunidades);
   }

   public oportunidadesEntity editar(int id, oportunidadesEntity oportunidades) {
      Optional<oportunidadesEntity> oportunidadesExistente = this.oportunidadesRepository.findById(id);
      if (oportunidadesExistente.isPresent()) {
         oportunidadesEntity oportunidadesAtualizada = (oportunidadesEntity) oportunidadesExistente.get();
         oportunidadesAtualizada.setNomeOportunidade(oportunidades.getNomeOportunidade());
         oportunidadesAtualizada.setValorEstimado(oportunidades.getValorEstimado());
         oportunidadesAtualizada.setDataDeFechamentoEstimada(oportunidades.getDataDeFechamentoEstimada());
         oportunidadesAtualizada.setEstagioFunil(oportunidades.getEstagioFunil());
         return (oportunidadesEntity) this.oportunidadesRepository.save(oportunidadesAtualizada);
      } else {
         return null;
      }
   }

   public List<oportunidadesEntity> listarTodos() {
      return this.oportunidadesRepository.findAll();
   }

   public void excluir(Integer id) {
      this.oportunidadesRepository.deleteById(id);
   }
}