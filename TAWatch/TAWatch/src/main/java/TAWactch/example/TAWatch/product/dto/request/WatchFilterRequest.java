package TAWactch.example.TAWatch.product.dto.request;

import java.math.BigDecimal;
import java.util.List;

public record WatchFilterRequest(
        String name,
        String sku,
        List<Integer> brandIds,
        List<Integer> categoryIds,
        List<Integer> segmentIds,
        List<String> movementTypes,
        BigDecimal minPrice,
        BigDecimal maxPrice,
        Integer page,
        Integer size,
        String sort
) {}
