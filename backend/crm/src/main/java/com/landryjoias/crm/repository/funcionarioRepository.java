package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.funcionarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface funcionarioRepository extends JpaRepository<funcionarioEntity, Integer> {
}
