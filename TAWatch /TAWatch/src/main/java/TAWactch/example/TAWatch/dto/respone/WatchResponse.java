package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.MovementType;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;

public record WatchResponse(
        Integer id,
        String sku,
        String name,
        Integer segmentId,
        String segmentName,
        String description,
        MovementType movementType,
        String glassMaterial,
        BigDecimal thicknessMm,
        BigDecimal waterResistanceAtm,
        Integer powerReserveHours,
        String batteryType,
        String features,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt,
        Integer brandId,
        String brandName,
        Integer categoryId,
        String categoryName
) implements Serializable {}
