package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.OportunidadesEntity;
import com.landryjoias.crm.repository.OportunidadesRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OportunidadesService {
   private final OportunidadesRepository oportunidadesRepository;

   public OportunidadesEntity incluir(OportunidadesEntity oportunidades) {
      return (OportunidadesEntity) this.oportunidadesRepository.save(oportunidades);
   }

   public OportunidadesEntity editar(int id, OportunidadesEntity oportunidades) {
      Optional<OportunidadesEntity> oportunidadesExistente = this.oportunidadesRepository.findById(id);
      if (oportunidadesExistente.isPresent()) {
         OportunidadesEntity oportunidadesAtualizada = (OportunidadesEntity) oportunidadesExistente.get();
         oportunidadesAtualizada.setNomeOportunidade(oportunidades.getNomeOportunidade());
         oportunidadesAtualizada.setValorEstimado(oportunidades.getValorEstimado());
         oportunidadesAtualizada.setDataDeFechamentoEstimada(oportunidades.getDataDeFechamentoEstimada());
         oportunidadesAtualizada.setEstagioFunil(oportunidades.getEstagioFunil());
         return (OportunidadesEntity) this.oportunidadesRepository.save(oportunidadesAtualizada);
      } else {
         return null;
      }
   }

   public List<OportunidadesEntity> listarTodos() {
      return this.oportunidadesRepository.findAll();
   }

   public void excluir(Integer id) {
      this.oportunidadesRepository.deleteById(id);
   }
}