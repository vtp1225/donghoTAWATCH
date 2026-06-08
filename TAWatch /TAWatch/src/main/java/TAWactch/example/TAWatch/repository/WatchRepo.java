package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Watch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WatchRepo extends JpaRepository<Watch, Integer> {
    boolean existsBySku(String sku);
    Optional<Watch> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Integer id);
}
