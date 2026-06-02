package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.WatchImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchImageRepo extends JpaRepository<WatchImage, Integer> {
    List<WatchImage> findByWatchIdOrderBySortOrderAsc(Integer watchId);
    List<WatchImage> findByWatchId(Integer watchId);
    void deleteByWatchId(Integer watchId);
}
