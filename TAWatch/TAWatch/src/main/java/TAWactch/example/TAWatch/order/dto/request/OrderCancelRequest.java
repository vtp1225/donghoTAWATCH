package TAWactch.example.TAWatch.order.dto.request;

public record OrderCancelRequest(
        Integer userId,
        String reason
) {}
