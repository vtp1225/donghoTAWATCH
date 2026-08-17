package TAWactch.example.TAWatch.admin.dto.response;

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
