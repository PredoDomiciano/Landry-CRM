package com.landryjoias.crm.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.landryjoias.crm.entity.clienteEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface clienteRepository extends JpaRepository<clienteEntity, Integer> {
}
