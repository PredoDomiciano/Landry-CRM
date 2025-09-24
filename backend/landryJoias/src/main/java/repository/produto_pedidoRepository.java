package repository;

import entities.produto_pedidoEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface produto_pedidoRepository extends JpaRepository<produto_pedidoEntities, Long> {
}
