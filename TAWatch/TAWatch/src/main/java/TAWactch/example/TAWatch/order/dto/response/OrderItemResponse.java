package TAWactch.example.TAWatch.order.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public record OrderItemResponse(
        Integer id,
        Integer watchVariantId,
        String watchName,
        String dialColor,
        String strapColor,
        String imageUrl,
        Map<String, Object> productSnapshot,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal unitCost,
        BigDecimal totalPrice
) {}
