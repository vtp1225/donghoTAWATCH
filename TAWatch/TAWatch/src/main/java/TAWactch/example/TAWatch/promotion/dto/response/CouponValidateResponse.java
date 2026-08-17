package TAWactch.example.TAWatch.promotion.dto.response;

import java.math.BigDecimal;

public record CouponValidateResponse(
        Integer couponId,
        String code,
        String promotionName,
        BigDecimal discountAmount,
        BigDecimal finalAmount
) {}
