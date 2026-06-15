package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.StrapMaterialType;

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
        Integer stockQuantity,
        Boolean isActive
) implements Serializable {}
