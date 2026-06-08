package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepo extends JpaRepository<Brand, Integer> {
    boolean existsByName(String name);
    Optional<Brand> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Integer id);
}
