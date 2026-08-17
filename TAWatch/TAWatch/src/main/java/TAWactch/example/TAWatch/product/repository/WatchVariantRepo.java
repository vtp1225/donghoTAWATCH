package TAWactch.example.TAWatch.product.repository;

import TAWactch.example.TAWatch.product.entity.WatchVariant;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchVariantRepo extends JpaRepository<WatchVariant, Integer> {
    List<WatchVariant> findByWatchId(Integer watchId);

    // Pessimistic write lock để chống race condition oversell khi đặt hàng
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<WatchVariant> findById(Integer id);

    @Query("SELECT v FROM WatchVariant v JOIN FETCH v.watch WHERE v.watch.id IN :watchIds AND v.isActive = true")
    List<WatchVariant> findActiveByWatchIds(@Param("watchIds") List<Integer> watchIds);

    @Query("SELECT v FROM WatchVariant v JOIN FETCH v.watch WHERE v.watch.id IN :watchIds")
    List<WatchVariant> findAllByWatchIds(@Param("watchIds") List<Integer> watchIds);

    // Atomic decrement để chống oversell — chỉ thành công nếu còn đủ kho
    @Modifying
    @Query("UPDATE WatchVariant v SET v.stockQuantity = v.stockQuantity - :qty WHERE v.id = :id AND v.stockQuantity >= :qty")
    int decrementStock(@Param("id") Integer id, @Param("qty") int qty);
}
