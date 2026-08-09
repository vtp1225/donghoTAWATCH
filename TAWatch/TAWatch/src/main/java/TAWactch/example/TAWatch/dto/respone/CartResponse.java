package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record CartResponse(
        Integer id,
        Integer userId,
        String sessionId,
        List<CartItemResponse> items,
        BigDecimal totalAmount,
        Instant createdAt,
        Instant updatedAt
) implements Serializable {}
