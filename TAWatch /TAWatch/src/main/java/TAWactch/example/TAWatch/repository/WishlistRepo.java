package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepo extends JpaRepository<Wishlist, Integer> {

    @Query("SELECT w FROM Wishlist w JOIN FETCH w.watchVariant v JOIN FETCH v.watch wt JOIN FETCH wt.brand WHERE w.user.id = :userId ORDER BY w.addedAt DESC")
    List<Wishlist> findByUserIdWithDetails(@Param("userId") Integer userId);

    Optional<Wishlist> findByUserIdAndWatchVariantId(Integer userId, Integer watchVariantId);

    boolean existsByUserIdAndWatchVariantId(Integer userId, Integer watchVariantId);

    void deleteByUserIdAndWatchVariantId(Integer userId, Integer watchVariantId);

    long countByUserId(Integer userId);
}
