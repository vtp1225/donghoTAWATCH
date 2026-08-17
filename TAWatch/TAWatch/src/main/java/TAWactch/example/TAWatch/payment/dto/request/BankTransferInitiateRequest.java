package TAWactch.example.TAWatch.payment.dto.request;

import jakarta.validation.constraints.NotNull;

public record BankTransferInitiateRequest(
        @NotNull Integer orderId
) {}
