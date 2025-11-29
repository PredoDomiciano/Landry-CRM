package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.ContatosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContatosRepository extends JpaRepository<ContatosEntity, Integer> {
}
