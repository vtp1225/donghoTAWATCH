package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
    List<Promotion> findByIsActive(Boolean isActive);
    boolean existsByName(String name);

    @Query("""
        SELECT DISTINCT p FROM Promotion p
        LEFT JOIN FETCH p.watches
        WHERE p.isActive = true
        AND p.startDate <= :now AND p.endDate >= :now
        AND (p.appliesToAll = true OR EXISTS (
            SELECT w FROM p.watches w WHERE w.id IN :watchIds
        ))
        """)
    List<Promotion> findActiveForWatches(@Param("watchIds") List<Integer> watchIds, @Param("now") Instant now);
}
