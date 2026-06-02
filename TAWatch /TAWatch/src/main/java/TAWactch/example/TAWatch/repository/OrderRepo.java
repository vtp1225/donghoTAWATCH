package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatusType status);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderCode(String orderCode);
}
