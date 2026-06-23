package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.DiscountType;
import TAWactch.example.TAWatch.Enum.PromoType;
import java.util.List;

import java.math.BigDecimal;
import java.time.Instant;

public record PromotionResponse(
        Integer id,
        String name,
        PromoType promoType,
        DiscountType discountType,
        BigDecimal discountValue,
        BigDecimal minOrderValue,
        BigDecimal maxDiscountAmount,
        Integer maxUses,
        Integer usedCount,
        Instant startDate,
        Instant endDate,
        Boolean isActive,
        Instant createdAt,
        List<Integer> watchIds,
        List<String> watchNames
) {}
