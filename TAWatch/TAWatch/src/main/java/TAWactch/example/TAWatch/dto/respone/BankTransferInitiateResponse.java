package TAWactch.example.TAWatch.dto.respone;

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
