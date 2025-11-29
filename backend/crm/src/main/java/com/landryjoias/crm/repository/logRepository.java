package com.landryjoias.crm.repository;

import com.landryjoias.crm.entity.logEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface logRepository extends JpaRepository<logEntity, Integer> {
}
