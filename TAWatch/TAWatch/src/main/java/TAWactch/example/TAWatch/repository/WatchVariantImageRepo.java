package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.WatchVariantImage;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchVariantImageRepo extends JpaRepository<WatchVariantImage, Integer> {

    @EntityGraph(attributePaths = {"variant", "variant.watch"})
    List<WatchVariantImage> findByVariantIdOrderBySortOrderAsc(Integer variantId);

    @EntityGraph(attributePaths = {"variant", "variant.watch"})
    List<WatchVariantImage> findByVariantId(Integer variantId);

    void deleteByVariantId(Integer variantId);

    @EntityGraph(attributePaths = {"variant", "variant.watch"})
    List<WatchVariantImage> findByVariant_Watch_Id(Integer watchId);

    @EntityGraph(attributePaths = {"variant", "variant.watch"})
    Optional<WatchVariantImage> findFirstByVariant_Watch_IdAndIsMainImageTrue(Integer watchId);

    @Query("SELECT i FROM WatchVariantImage i JOIN FETCH i.variant v JOIN FETCH v.watch w WHERE w.id IN :watchIds AND i.isMainImage = true")
    List<WatchVariantImage> findMainImagesByWatchIds(@Param("watchIds") List<Integer> watchIds);
}
