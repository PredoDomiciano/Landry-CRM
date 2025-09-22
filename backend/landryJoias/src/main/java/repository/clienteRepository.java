package repository;

import entities.EstagioFunil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import entities.clienteEntities;
import java.util.List;
@Repository
public interface clienteRepository extends JpaRepository<clienteRepository, Long> {
    List<clienteRepository> findByEstagioFunil(EstagioFunil funil);


    List<clienteRepository> findByNomeContainingIgnoreCase(String nome);
}
