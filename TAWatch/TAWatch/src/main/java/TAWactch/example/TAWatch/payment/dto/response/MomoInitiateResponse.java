package TAWactch.example.TAWatch.payment.dto.response;

import java.math.BigDecimal;

public record MomoInitiateResponse(
        Integer transactionId,
        String orderCode,
        BigDecimal amount,
        String paymentUrl,
        String status
) {}
