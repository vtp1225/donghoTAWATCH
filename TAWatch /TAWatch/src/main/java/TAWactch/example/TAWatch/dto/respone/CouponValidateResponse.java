package TAWactch.example.TAWatch.dto.respone;

import java.math.BigDecimal;

public record CouponValidateResponse(
        Integer couponId,
        String code,
        String promotionName,
        BigDecimal discountAmount,
        BigDecimal finalAmount
) {}
