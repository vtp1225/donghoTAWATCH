package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.WatchVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WatchVariantRepo extends JpaRepository<WatchVariant, Integer> {
    List<WatchVariant> findByWatchId(Integer watchId);

    @Query("SELECT v FROM WatchVariant v JOIN FETCH v.watch WHERE v.watch.id IN :watchIds AND v.isActive = true")
    List<WatchVariant> findActiveByWatchIds(@Param("watchIds") List<Integer> watchIds);

    @Query("SELECT v FROM WatchVariant v JOIN FETCH v.watch WHERE v.watch.id IN :watchIds")
    List<WatchVariant> findAllByWatchIds(@Param("watchIds") List<Integer> watchIds);
}
