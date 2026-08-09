package TAWactch.example.TAWatch.dto.respone;

import java.time.Instant;

public record ColorResponse(
        Integer id,
        String name,
        String hexCode,
        Boolean isActive,
        Instant createdAt,
        Instant updatedAt
) {}
