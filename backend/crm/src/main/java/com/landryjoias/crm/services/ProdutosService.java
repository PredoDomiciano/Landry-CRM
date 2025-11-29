package com.landryjoias.crm.services;

import com.landryjoias.crm.entity.ProdutosEntity;
import com.landryjoias.crm.repository.ProdutosRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProdutosService {
   private final ProdutosRepository produtosRepository;

   public ProdutosEntity incluir(ProdutosEntity produtos) {
      return (ProdutosEntity) this.produtosRepository.save(produtos);
   }

   public ProdutosEntity editar(int id, ProdutosEntity produtos) {
      Optional<ProdutosEntity> produtosExistente = this.produtosRepository.findById(id);
      if (produtosExistente.isPresent()) {
         ProdutosEntity produtosAtualizada = (ProdutosEntity) produtosExistente.get();
         produtosAtualizada.setNome(produtos.getNome());

         produtosAtualizada.setDescricao(produtos.getDescricao());
         produtosAtualizada.setTipo(produtos.getTipo());
         produtosAtualizada.setTamanho(produtos.getTamanho());
         produtosAtualizada.setValor(produtos.getValor());
         produtosAtualizada.setQuantidadeEstoque(produtos.getQuantidadeEstoque());
         produtosAtualizada.setMaterial(produtos.getMaterial());
         return (ProdutosEntity) this.produtosRepository.save(produtosAtualizada);
      } else {
         return null;
      }
   }

   public List<ProdutosEntity> listarTodos() {
      return this.produtosRepository.findAll();
   }

   public void excluir(Integer id) {
      this.produtosRepository.deleteById(id);
   }

}