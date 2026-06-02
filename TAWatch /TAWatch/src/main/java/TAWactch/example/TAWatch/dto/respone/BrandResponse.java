package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;
import java.time.Instant;

public record BrandResponse(
        Integer id,
        String name,
        String country,
        String description,
        String logoUrl,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) implements Serializable {}
