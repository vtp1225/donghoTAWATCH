package TAWactch.example.TAWatch.product.dto.response;

import java.time.Instant;

public record ColorResponse(
        Integer id,
        String name,
        String hexCode,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {}
