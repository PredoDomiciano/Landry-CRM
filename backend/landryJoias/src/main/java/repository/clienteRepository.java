package repository;


import org.springframework.data.jpa.repository.JpaRepository;
import entities.clienteEntities;
import org.springframework.stereotype.Repository;

@Repository
public interface clienteRepository extends JpaRepository<clienteEntities, Long> {
}
