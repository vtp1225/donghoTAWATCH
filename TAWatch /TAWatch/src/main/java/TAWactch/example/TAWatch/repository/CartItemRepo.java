package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepo extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(Integer cartId);
    Optional<CartItem> findByCartIdAndWatchVariantId(Integer cartId, Integer watchVariantId);
    void deleteAllByCartId(Integer cartId);
}
