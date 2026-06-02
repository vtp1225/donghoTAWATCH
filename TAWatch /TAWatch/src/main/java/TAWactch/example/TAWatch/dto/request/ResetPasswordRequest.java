package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank String resetToken,
        @NotBlank @Size(min = 6, message = "PASSWORD_VALID") String newPassword
) {}
