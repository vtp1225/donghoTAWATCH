package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import TAWactch.example.TAWatch.Enum.PaymentStatusType;
import TAWactch.example.TAWatch.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Integer userId);
    List<Order> findByOrderStatusOrderByCreatedAtDesc(OrderStatusType status);
    List<Order> findAllByOrderByCreatedAtDesc();
    Optional<Order> findByOrderCode(String orderCode);
    boolean existsByUserIdAndCouponId(Integer userId, Integer couponId);
    List<Order> findByPaymentMethodAndPaymentStatusAndOrderStatusAndCreatedAtBefore(
            PaymentMethodType  paymentMethodType, PaymentStatusType paymentStatus, OrderStatusType orderStatus, Instant timeLimit
            );

}
