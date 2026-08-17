package TAWactch.example.TAWatch.product.dto.response;

import TAWactch.example.TAWatch.common.enums.StrapMaterialType;

import java.io.Serializable;
import java.math.BigDecimal;

public record WatchVariantResponse(
        Integer id,
        Integer watchId,
        String watchName,
        Integer dialColorId,
        String dialColorName,
        String dialColorHex,
        Integer strapColorId,
        String strapColorName,
        String strapColorHex,
        StrapMaterialType strapMaterial,
        BigDecimal caseSizeMm,
        BigDecimal price,
        BigDecimal costPrice,
        Integer stockQuantity,
        Boolean isActive,
        BigDecimal salePrice
) implements Serializable {}
