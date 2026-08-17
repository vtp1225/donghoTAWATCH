package TAWactch.example.TAWatch.promotion.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record CouponValidateRequest(
        @NotNull String code,
        @NotNull @Positive BigDecimal subtotal,
        java.util.List<Integer> watchIds
) {}
