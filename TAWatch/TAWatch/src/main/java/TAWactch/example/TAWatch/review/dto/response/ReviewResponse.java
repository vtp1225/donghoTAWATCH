package TAWactch.example.TAWatch.review.dto.response;

import java.time.Instant;

public record ReviewResponse(
        Integer id,
        Integer userId,
        String userFullName,
        Integer watchId,
        String watchName,
        Integer orderId,
        String orderCode,
        Integer rating,
        String comment,
        Boolean isApproved,
        Instant createdAt,
        String watchMainImageUrl
) {}
