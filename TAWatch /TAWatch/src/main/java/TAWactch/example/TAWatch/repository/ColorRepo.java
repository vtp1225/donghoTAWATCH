package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColorRepo extends JpaRepository<Color, Integer> {
    boolean existsByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCaseAndIdNot(String name, Integer id);
    Optional<Color> findByNameIgnoreCase(String name);
    List<Color> findByIsActiveTrueOrderByNameAsc();
    List<Color> findAllByOrderByNameAsc();
}
