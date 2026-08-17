package TAWactch.example.TAWatch.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank String accessToken
) {}
