package repository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface usuarioRepository extends JpaRepository<contatosRepository, Long> {
}
