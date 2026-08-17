package TAWactch.example.TAWatch.cart.dto.response;

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
        Integer stockQuantity,
        BigDecimal unitPrice,
        BigDecimal subtotal
) implements Serializable {}
