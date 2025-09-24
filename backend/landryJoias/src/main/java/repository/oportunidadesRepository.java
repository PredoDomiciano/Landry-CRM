package repository;

import entities.oportunidadesEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface oportunidadesRepository extends JpaRepository<oportunidadesEntities, Long> {
}
