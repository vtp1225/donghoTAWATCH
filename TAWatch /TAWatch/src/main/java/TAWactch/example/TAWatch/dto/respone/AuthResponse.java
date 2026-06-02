package TAWactch.example.TAWatch.dto.respone;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserRespone user
) {}
