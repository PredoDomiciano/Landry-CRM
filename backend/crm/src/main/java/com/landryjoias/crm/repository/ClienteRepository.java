package com.landryjoias.crm.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.landryjoias.crm.entity.ClienteEntity;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<ClienteEntity, Integer> {
}
