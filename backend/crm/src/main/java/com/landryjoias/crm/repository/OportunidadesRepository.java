package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.OportunidadesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OportunidadesRepository extends JpaRepository<OportunidadesEntity, Integer> {
}
