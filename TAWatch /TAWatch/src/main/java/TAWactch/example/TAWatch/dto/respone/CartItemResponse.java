package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;
import java.math.BigDecimal;

public record CartItemResponse(
        Integer id,
        Integer cartId,
        Integer watchVariantId,
        String watchName,
        String dialColor,
        String strapColor,
        String imageUrl,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) implements Serializable {}
