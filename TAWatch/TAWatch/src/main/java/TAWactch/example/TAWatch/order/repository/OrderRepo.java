package TAWactch.example.TAWatch.order.repository;

import TAWactch.example.TAWatch.common.enums.OrderStatusType;
import TAWactch.example.TAWatch.common.enums.PaymentMethodType;
import TAWactch.example.TAWatch.common.enums.PaymentStatusType;
import TAWactch.example.TAWatch.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
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
    List<Order> findByOrderStatusAndDeliveredAtBeforeAndLoyaltyPointsGrantedFalse(OrderStatusType status, Instant timeLimit);

}
