package TAWactch.example.TAWatch.dto.request;

public record PaymentConfirmRequest(
        String transactionCode,
        String note
) {}
