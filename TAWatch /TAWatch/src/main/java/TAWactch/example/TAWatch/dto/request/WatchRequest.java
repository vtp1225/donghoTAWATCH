package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.MovementType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

public record WatchRequest(
        @NotNull @Size(max = 50) String sku,
        @NotNull @Size(max = 255) String name,
        @Size(max = 255) String slug,
        @NotNull Integer segmentId,
        String description,
        @NotNull MovementType movementType,
        @Size(max = 100) String glassMaterial,
        BigDecimal thicknessMm,
        BigDecimal waterResistanceAtm,
        Integer powerReserveHours,
        @Size(max = 50) String batteryType,
        String features,
        Boolean isActive,
        @NotNull Integer brandId,
        @NotNull Integer categoryId
) implements Serializable {}
