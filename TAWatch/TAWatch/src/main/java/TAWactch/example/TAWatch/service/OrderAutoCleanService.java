package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import TAWactch.example.TAWatch.Enum.PaymentStatusType;
import TAWactch.example.TAWatch.entity.Order;
import TAWactch.example.TAWatch.entity.OrderItem;
import TAWactch.example.TAWatch.entity.WatchVariant;
import TAWactch.example.TAWatch.repository.OrderItemRepo;
import TAWactch.example.TAWatch.repository.OrderRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class OrderAutoCleanService {
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private OrderItemRepo orderItemRepo;
    @Autowired
    private WatchVariantRepo watchVariantRepo;
    @Scheduled(fixedRate = 1200000)
    @Transactional
    public void autoClean() {
        Instant limit = Instant.now().minus(15, ChronoUnit.MINUTES);
        List<Order> orders = orderRepo.findByPaymentMethodAndPaymentStatusAndOrderStatusAndCreatedAtBefore(
                PaymentMethodType.VNPAY,
                PaymentStatusType.UNPAID,
                OrderStatusType.PENDING,
                limit
        );
        for (Order order : orders) {
            order.setOrderStatus(OrderStatusType.CANCELLED);
            order.setNote("Huy vi qua thoi han thanh toan VNPAY");
            order.setUpdatedAt(Instant.now());
            orderRepo.save(order);
            List<OrderItem> orderItems = orderItemRepo.findByOrderId(order.getId());
            for (OrderItem orderItem : orderItems) {
                WatchVariant watchVariant = orderItem.getWatchVariant();
                watchVariant.setStockQuantity(watchVariant.getStockQuantity() + orderItem.getQuantity());
                watchVariantRepo.save(watchVariant);
            }
        }

    }
}
