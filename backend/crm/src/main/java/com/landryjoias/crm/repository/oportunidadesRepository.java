package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.oportunidadesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface oportunidadesRepository extends JpaRepository<oportunidadesEntity, Integer> {
}
