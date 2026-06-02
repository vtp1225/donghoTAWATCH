package TAWactch.example.TAWatch.dto.request;

public record OrderCancelRequest(
        Integer userId,
        String reason
) {}
