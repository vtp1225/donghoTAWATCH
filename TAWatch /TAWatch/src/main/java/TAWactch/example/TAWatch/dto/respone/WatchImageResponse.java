package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;

public record WatchImageResponse(
        Integer id,
        Integer watchId,
        String watchName,
        String url,
        String altText,
        Boolean isPrimary,
        Integer sortOrder
) implements Serializable {}
