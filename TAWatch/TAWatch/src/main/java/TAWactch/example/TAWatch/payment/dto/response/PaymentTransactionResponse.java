package TAWactch.example.TAWatch.payment.dto.response;

import TAWactch.example.TAWatch.common.enums.GatewayType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

public record PaymentTransactionResponse(
        Integer id,
        Integer orderId,
        String orderCode,
        String transactionCode,
        GatewayType gateway,
        BigDecimal amount,
        String status,
        Map<String, Object> responseData,
        Instant createdAt,
        Instant updatedAt
) {}
