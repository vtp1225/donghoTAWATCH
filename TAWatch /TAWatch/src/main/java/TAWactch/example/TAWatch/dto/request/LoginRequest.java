package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(
        @NotBlank @Size(max = 150) @Email(message = "EMAIL_VALID") String email,
        @NotBlank String password
) {}
