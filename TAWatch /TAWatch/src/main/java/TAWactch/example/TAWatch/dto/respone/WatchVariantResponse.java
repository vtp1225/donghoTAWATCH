package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;
import java.math.BigDecimal;

public record WatchVariantResponse(
        Integer id,
        Integer watchId,
        String watchName,
        String dialColor,
        String strapColor,
        String strapMaterial,
        BigDecimal caseSizeMm,
        BigDecimal price,
        Integer stockQuantity,
        Boolean isActive
) implements Serializable {}
