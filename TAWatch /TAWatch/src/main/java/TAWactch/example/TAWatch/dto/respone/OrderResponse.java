package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;
import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import TAWactch.example.TAWatch.Enum.PaymentStatusType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Integer id,
        String orderCode,
        Integer userId,
        String guestName,
        String guestEmail,
        String guestPhone,
        String shippingAddressSnapshot,
        BigDecimal subtotal,
        BigDecimal discountAmount,
        BigDecimal shippingFee,
        BigDecimal totalAmount,
        PaymentMethodType paymentMethod,
        PaymentStatusType paymentStatus,
        OrderStatusType orderStatus,
        DeliveryMethodType deliveryMethod,
        String trackingCode,
        String note,
        List<OrderItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {}
