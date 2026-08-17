package TAWactch.example.TAWatch.order.repository;

import TAWactch.example.TAWatch.order.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepo extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderId(Integer orderId);

    boolean existsByWatchVariantId(Integer watchVariantId);
}
