package TAWactch.example.TAWatch.promotion.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CouponRequest(
        @NotNull Integer promotionId,
        @NotNull @Size(max = 50) String code,
        Integer userId
) {}
