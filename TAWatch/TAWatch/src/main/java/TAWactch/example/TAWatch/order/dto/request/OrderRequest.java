package TAWactch.example.TAWatch.order.dto.request;

import TAWactch.example.TAWatch.common.enums.DeliveryMethodType;
import TAWactch.example.TAWatch.common.enums.PaymentMethodType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.util.List;

public record OrderRequest(
        Integer userId,
        Integer addressId,
        String guestName,
        String guestEmail,
        @Pattern(regexp = "^(0|84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ") String guestPhone,
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
