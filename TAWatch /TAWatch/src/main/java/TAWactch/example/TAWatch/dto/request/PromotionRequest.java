package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.DiscountType;
import TAWactch.example.TAWatch.Enum.PromoType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;

public record PromotionRequest(
        @NotNull @Size(max = 255) String name,
        @NotNull PromoType promoType,
        @NotNull DiscountType discountType,
        @NotNull @Positive BigDecimal discountValue,
        BigDecimal minOrderValue,
        BigDecimal maxDiscountAmount,
        Integer maxUses,
        @NotNull Instant startDate,
        @NotNull Instant endDate,
        Boolean isActive
) {}
