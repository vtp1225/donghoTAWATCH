package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {

    @Query("""
        SELECT ci FROM CartItem ci
        JOIN FETCH ci.watchVariant v
        JOIN FETCH v.watch
        LEFT JOIN FETCH v.dialColor
        LEFT JOIN FETCH v.strapColor
        WHERE ci.cart.id = :cartId
        """)
    List<CartItem> findByCartId(@Param("cartId") Integer cartId);

    Optional<CartItem> findByCartIdAndWatchVariantId(Integer cartId, Integer watchVariantId);
    void deleteAllByCartId(Integer cartId);
    void deleteByWatchVariantId(Integer watchVariantId);
}
