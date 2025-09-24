package repository;

import entities.pedidosEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface pedidosRepository extends JpaRepository<pedidosEntities, Long> {
}
