package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.StrapMaterialType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

public record WatchVariantRequest(
        @NotNull Integer watchId,
        Integer dialColorId,
        Integer strapColorId,
        StrapMaterialType strapMaterial,
        BigDecimal caseSizeMm,
        @NotNull BigDecimal price,
        @Size(max = 500) String imageUrl,
        Integer stockQuantity,
        Boolean isActive
) implements Serializable {}
