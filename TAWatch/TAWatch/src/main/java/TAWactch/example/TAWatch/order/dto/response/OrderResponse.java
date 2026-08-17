package TAWactch.example.TAWatch.order.dto.response;

import TAWactch.example.TAWatch.common.enums.DeliveryMethodType;
import TAWactch.example.TAWatch.common.enums.OrderStatusType;
import TAWactch.example.TAWatch.common.enums.PaymentMethodType;
import TAWactch.example.TAWatch.common.enums.PaymentStatusType;
import TAWactch.example.TAWatch.user.dto.response.UserResponse;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record OrderResponse(
        Integer id,
        String orderCode,
        UserResponse user,
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
        String returnReason,
        List<OrderItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {}
