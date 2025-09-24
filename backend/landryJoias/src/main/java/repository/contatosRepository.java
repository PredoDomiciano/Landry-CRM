package repository;

import entities.contatosEntities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository


public interface contatosRepository extends JpaRepository<contatosEntities, Long> {

}
