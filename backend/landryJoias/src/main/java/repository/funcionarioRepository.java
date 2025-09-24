package repository;

import entities.funcionarioEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface funcionarioRepository extends JpaRepository<funcionarioEntities, Long> {
}
