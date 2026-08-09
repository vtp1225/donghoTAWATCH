package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;

public record GoogleLoginRequest(
        @NotBlank String accessToken
) {}
