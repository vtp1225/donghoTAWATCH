package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.WatchVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchVariantRepo extends JpaRepository<WatchVariant, Integer> {
    List<WatchVariant> findByWatchId(Integer watchId);
}
