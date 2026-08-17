package TAWactch.example.TAWatch.payment.dto.response;

import java.math.BigDecimal;

public record BankTransferInitiateResponse(
        Integer transactionId,
        String orderCode,
        BigDecimal amount,
        String bankName,
        String accountNumber,
        String accountName,
        String transferContent,
        String status
) {}
