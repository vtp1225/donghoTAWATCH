package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Watch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WatchRepo extends JpaRepository<Watch, Integer> {
    boolean existsBySku(String sku);
}
