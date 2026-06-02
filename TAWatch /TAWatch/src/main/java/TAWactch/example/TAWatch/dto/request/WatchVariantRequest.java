package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

public record WatchVariantRequest(
        @NotNull Integer watchId,
        @Size(max = 80) String dialColor,
        @Size(max = 80) String strapColor,
        @Size(max = 100) String strapMaterial,
        BigDecimal caseSizeMm,
        @NotNull BigDecimal price,
        @Size(max = 500) String imageUrl,
        Integer stockQuantity,
        Boolean isActive
) implements Serializable {}
