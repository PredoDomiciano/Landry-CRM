package repository;

import entities.logEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface logRepository extends JpaRepository<logEntities, Long> {
}
