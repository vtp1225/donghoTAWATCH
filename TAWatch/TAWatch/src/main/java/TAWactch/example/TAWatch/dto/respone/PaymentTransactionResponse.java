package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.GatewayType;

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
