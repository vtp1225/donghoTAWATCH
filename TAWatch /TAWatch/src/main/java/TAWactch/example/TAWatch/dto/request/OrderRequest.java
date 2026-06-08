package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record OrderRequest(
        // Nếu null → đơn khách vãng lai
        Integer userId,
        // ID địa chỉ đã lưu (chỉ dùng khi userId != null)
        Integer addressId,
        // Thông tin giao hàng cho khách vãng lai
        String guestName,
        String guestEmail,
        String guestPhone,
        String guestAddressDetail,
        @NotNull PaymentMethodType paymentMethod,
        @NotNull DeliveryMethodType deliveryMethod,
        String couponCode,
        String note,
        @NotNull @NotEmpty @Valid List<OrderItemRequest> items
) {}
