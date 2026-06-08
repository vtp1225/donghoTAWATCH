package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepo extends JpaRepository<Promotion, Integer> {
    List<Promotion> findByIsActive(Boolean isActive);
    boolean existsByName(String name);
}
