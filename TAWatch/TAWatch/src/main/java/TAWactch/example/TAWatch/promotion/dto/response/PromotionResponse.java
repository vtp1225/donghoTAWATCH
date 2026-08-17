package TAWactch.example.TAWatch.promotion.dto.response;

import TAWactch.example.TAWatch.common.enums.DiscountType;
import TAWactch.example.TAWatch.common.enums.PromoType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

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
        List<String> watchNames,
        List<String> watchSlugs
) {}
