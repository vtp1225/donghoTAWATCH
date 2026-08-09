package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Segment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SegmentRepo extends JpaRepository<Segment, Integer> {

    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Integer id);
    Optional<Segment> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Integer id);
}
