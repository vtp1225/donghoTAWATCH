package TAWactch.example.TAWatch.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Size(max = 150) String email,
        @NotBlank String password
) {}
