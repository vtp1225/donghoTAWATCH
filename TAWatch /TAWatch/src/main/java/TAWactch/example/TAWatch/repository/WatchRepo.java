package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Watch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface WatchRepo extends JpaRepository<Watch, Integer> {
    boolean existsBySku(String sku);
    Optional<Watch> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsBySlugAndIdNot(String slug, Integer id);
    List<Watch> findByIsActiveTrue();
    Page<Watch> findByIsActiveTrue(Pageable pageable);

    List<Watch> findByIsFeaturedTrueAndIsActiveTrue();

    List<Watch> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    List<Watch> findByIdInAndIsActiveTrue(List<Integer> ids);

    @Query("SELECT w FROM Watch w WHERE w.category.id = :categoryId AND w.isActive = true")
    List<Watch> findByCategoryIdActive(@Param("categoryId") Integer categoryId, Pageable pageable);

    @Query("""
        SELECT w FROM Watch w
        WHERE (:search IS NULL OR LOWER(w.name) LIKE LOWER(CONCAT('%', :search, '%'))
               OR LOWER(w.sku) LIKE LOWER(CONCAT('%', :search, '%')))
        AND (:brandId IS NULL OR w.brand.id = :brandId)
        AND (:categoryId IS NULL OR w.category.id = :categoryId)
        AND (:segmentId IS NULL OR w.segment.id = :segmentId)
        AND (:isActive IS NULL OR w.isActive = :isActive)
        """)
    Page<Watch> searchAdmin(
        @Param("search") String search,
        @Param("brandId") Integer brandId,
        @Param("categoryId") Integer categoryId,
        @Param("segmentId") Integer segmentId,
        @Param("isActive") Boolean isActive,
        Pageable pageable
    );

    @Query("""
        SELECT w FROM Watch w
        WHERE w.isActive = true
        AND (:hasBrands = false OR w.brand.id IN :brandIds)
        AND (:hasCategories = false OR w.category.id IN :categoryIds)
        AND (:hasSegments = false OR w.segment.id IN :segmentIds)
        AND (:hasMovements = false OR w.movementType IN :movementTypes)
        AND (:minPrice IS NULL OR EXISTS (
            SELECT v FROM WatchVariant v WHERE v.watch = w AND v.isActive = true AND v.price >= :minPrice
        ))
        AND (:maxPrice IS NULL OR EXISTS (
            SELECT v FROM WatchVariant v WHERE v.watch = w AND v.isActive = true AND v.price <= :maxPrice
        ))
        """)
    Page<Watch> searchPublic(
        @Param("brandIds") List<Integer> brandIds,
        @Param("hasBrands") boolean hasBrands,
        @Param("categoryIds") List<Integer> categoryIds,
        @Param("hasCategories") boolean hasCategories,
        @Param("segmentIds") List<Integer> segmentIds,
        @Param("hasSegments") boolean hasSegments,
        @Param("movementTypes") List<String> movementTypes,
        @Param("hasMovements") boolean hasMovements,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        Pageable pageable
    );
}
