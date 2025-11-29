package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.produtosEntity;
import com.landryjoias.crm.repository.produtosRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class produtosService {
   private final produtosRepository produtosRepository;

   public produtosEntity incluir(produtosEntity produtos) {
      return (produtosEntity) this.produtosRepository.save(produtos);
   }

   public produtosEntity editar(int id, produtosEntity produtos) {
      Optional<produtosEntity> produtosExistente = this.produtosRepository.findById(id);
      if (produtosExistente.isPresent()) {
         produtosEntity produtosAtualizada = (produtosEntity) produtosExistente.get();
         produtosAtualizada.setNome(produtos.getNome());

         produtosAtualizada.setDescricao(produtos.getDescricao());
         produtosAtualizada.setTipo(produtos.getTipo());
         produtosAtualizada.setTamanho(produtos.getTamanho());
         produtosAtualizada.setValor(produtos.getValor());
         produtosAtualizada.setQuantidadeEstoque(produtos.getQuantidadeEstoque());
         produtosAtualizada.setMaterial(produtos.getMaterial());
         return (produtosEntity) this.produtosRepository.save(produtosAtualizada);
      } else {
         return null;
      }
   }

   public List<produtosEntity> listarTodos() {
      return this.produtosRepository.findAll();
   }

   public void excluir(Integer id) {
      this.produtosRepository.deleteById(id);
   }

}