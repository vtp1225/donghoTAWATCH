package TAWactch.example.TAWatch.dto.respone;

import java.time.Instant;

public record CouponResponse(
        Integer id,
        String code,
        Integer promotionId,
        String promotionName,
        Integer userId,
        Boolean isUsed,
        Instant usedAt,
        Instant expiresAt
) {}
