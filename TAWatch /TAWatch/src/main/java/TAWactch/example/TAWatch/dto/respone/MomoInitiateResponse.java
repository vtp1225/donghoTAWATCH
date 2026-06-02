package TAWactch.example.TAWatch.dto.respone;

import java.math.BigDecimal;

public record MomoInitiateResponse(
        Integer transactionId,
        String orderCode,
        BigDecimal amount,
        String paymentUrl,
        String status
) {}
