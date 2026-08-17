package TAWactch.example.TAWatch.promotion.dto.request;

import TAWactch.example.TAWatch.common.enums.DiscountType;
import TAWactch.example.TAWatch.common.enums.PromoType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record PromotionRequest(
        @NotNull @Size(max = 255) String name,
        @NotNull PromoType promoType,
        @NotNull DiscountType discountType,
        @NotNull @Positive BigDecimal discountValue,
        @PositiveOrZero(message = "Giá trị đơn hàng tối thiểu không được nhỏ hơn 0") BigDecimal minOrderValue,
        @PositiveOrZero(message = "Số tiền giảm tối đa không được nhỏ hơn 0") BigDecimal maxDiscountAmount,
        Integer maxUses,
        @NotNull Instant startDate,
        @NotNull Instant endDate,
        Boolean isActive,
        List<Integer> watchIds
) {}
