package TAWactch.example.TAWatch.auth.dto.response;

import TAWactch.example.TAWatch.user.dto.response.UserResponse;

public record AuthResponse(
        String accessToken,
        String tokenType,
        UserResponse user
) {}
