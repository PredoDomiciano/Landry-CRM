package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.produtosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface produtosRepository extends JpaRepository<produtosEntity, Integer> {
}
