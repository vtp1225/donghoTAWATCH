package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;

public record VNPayPaymentRequest(
        @NotNull Integer orderId,
        String returnUrl
) {}
