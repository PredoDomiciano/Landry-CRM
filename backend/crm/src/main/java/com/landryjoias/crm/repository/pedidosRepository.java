package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.pedidosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface pedidosRepository extends JpaRepository<pedidosEntity, Integer> {
}
