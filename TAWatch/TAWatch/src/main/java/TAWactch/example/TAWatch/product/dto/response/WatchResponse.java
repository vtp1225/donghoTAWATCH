package TAWactch.example.TAWatch.product.dto.response;

import TAWactch.example.TAWatch.common.enums.GlassMaterialType;
import TAWactch.example.TAWatch.common.enums.MovementType;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public record WatchResponse(
        Integer id,
        String sku,
        String name,
        String slug,
        Integer segmentId,
        String segmentName,
        String description,
        MovementType movementType,
        GlassMaterialType glassMaterial,
        BigDecimal thicknessMm,
        BigDecimal waterResistanceAtm,
        Integer powerReserveHours,
        String batteryType,
        String features,
        Boolean isActive,
        Boolean isFeatured,
        Instant createdAt,
        Instant updatedAt,
        Integer brandId,
        String brandName,
        Integer categoryId,
        String categoryName,
        BigDecimal minPrice,
        String mainImageUrl,
        Integer defaultVariantId,
        Integer totalStock,
        BigDecimal salePrice,
        Integer discountPercent
) implements Serializable {}
