package TAWactch.example.TAWatch.payment.dto.request;

public record PaymentConfirmRequest(
        String transactionCode,
        String note
) {}
