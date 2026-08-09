package TAWactch.example.TAWatch.dto.respone;

import java.math.BigDecimal;

public record VnpayInitiateResponse(
        Integer transactionId,
        String orderCode,
        BigDecimal amount,
        String paymentUrl,
        String status
) {}
