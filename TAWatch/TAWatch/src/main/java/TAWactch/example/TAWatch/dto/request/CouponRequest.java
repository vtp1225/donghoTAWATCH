package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record CouponRequest(
        @NotNull Integer promotionId,
        @NotNull @Size(max = 50) String code,
        Integer userId,
        Instant expiresAt
) {}
