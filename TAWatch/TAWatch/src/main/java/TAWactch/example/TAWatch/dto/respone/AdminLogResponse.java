package TAWactch.example.TAWatch.dto.respone;

import java.time.Instant;
import java.util.Map;

public record AdminLogResponse(
        Integer id,
        String adminName,
        String adminEmail,
        String action,
        String tableName,
        String ipAddress,
        Map<String, Object> newValue,
        Instant createdAt
) {}
