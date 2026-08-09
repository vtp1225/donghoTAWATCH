package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Integer> {

    List<Review> findByWatchIdOrderByCreatedAtDesc(Integer watchId);

    List<Review> findByWatchIdAndIsApprovedOrderByCreatedAtDesc(Integer watchId, Boolean isApproved);

    List<Review> findByUserIdOrderByCreatedAtDesc(Integer userId);

    List<Review> findAllByOrderByCreatedAtDesc();

    List<Review> findByIsApprovedOrderByCreatedAtDesc(Boolean isApproved);

    boolean existsByUserIdAndWatchIdAndOrderId(Integer userId, Integer watchId, Integer orderId);

    void deleteByWatchId(Integer watchId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.watch.id = :watchId AND r.isApproved = true")
    Double findAverageRatingByWatchId(@Param("watchId") Integer watchId);
}
