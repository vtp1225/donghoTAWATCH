package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequest(
        Integer userId,
        Integer addressId,
        String guestName,
        String guestEmail,
        String guestPhone,
        String guestAddressDetail,
        @NotNull PaymentMethodType paymentMethod,
        @NotNull DeliveryMethodType deliveryMethod,
        String couponCode,
        String note,
        BigDecimal shippingFee,
        Integer ghnDistrictId,
        String ghnWardCode,
        @NotNull @NotEmpty @Valid List<OrderItemRequest> items
) {}
