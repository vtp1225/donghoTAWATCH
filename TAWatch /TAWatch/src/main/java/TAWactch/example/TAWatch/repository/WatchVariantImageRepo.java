package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.WatchVariantImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchVariantImageRepo extends JpaRepository<WatchVariantImage, Integer> {
    List<WatchVariantImage> findByVariantIdOrderBySortOrderAsc(Integer variantId);
    List<WatchVariantImage> findByVariantId(Integer variantId);
    void deleteByVariantId(Integer variantId);
    List<WatchVariantImage> findByVariant_Watch_Id(Integer watchId);
    Optional<WatchVariantImage> findFirstByVariant_Watch_IdAndIsMainImageTrue(Integer watchId);
}
