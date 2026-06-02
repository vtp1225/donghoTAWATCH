package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;

public record MomoPaymentRequest(
        @NotNull Integer orderId
) {}
