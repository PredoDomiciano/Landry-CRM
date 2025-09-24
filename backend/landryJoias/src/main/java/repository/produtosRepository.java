package repository;

import entities.produtosEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface produtosRepository extends JpaRepository<produtosEntities, Long> {
}
