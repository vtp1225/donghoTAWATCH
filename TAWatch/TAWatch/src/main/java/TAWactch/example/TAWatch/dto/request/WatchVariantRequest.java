package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.StrapMaterialType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.math.BigDecimal;

public record WatchVariantRequest(
        @NotNull Integer watchId,
        Integer dialColorId,
        Integer strapColorId,
        StrapMaterialType strapMaterial,
        BigDecimal caseSizeMm,
        @NotNull @PositiveOrZero(message = "Giá tiền không được nhỏ hơn 0") BigDecimal price,
        @PositiveOrZero(message = "Giá vốn không được nhỏ hơn 0") BigDecimal costPrice,
        @Size(max = 500) String imageUrl,
        Boolean isActive
) implements Serializable {}
