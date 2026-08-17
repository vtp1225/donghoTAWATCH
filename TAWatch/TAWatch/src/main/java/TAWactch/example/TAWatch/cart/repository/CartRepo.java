package TAWactch.example.TAWatch.cart.repository;

import TAWactch.example.TAWatch.cart.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepo extends JpaRepository<Cart, Integer> {
    Optional<Cart> findByUserId(Integer userId);
    Optional<Cart> findBySessionId(String sessionId);
}
