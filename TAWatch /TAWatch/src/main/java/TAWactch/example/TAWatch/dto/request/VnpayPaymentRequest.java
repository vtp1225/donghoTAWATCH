package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;

public record VnpayPaymentRequest(
        @NotNull Integer orderId
) {}
