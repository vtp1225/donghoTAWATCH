package TAWactch.example.TAWatch.payment.dto.request;

import jakarta.validation.constraints.NotNull;

public record VNPayPaymentRequest(
        @NotNull Integer orderId,
        String returnUrl
) {}
