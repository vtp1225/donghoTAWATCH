package TAWactch.example.TAWatch.auth.dto.request;

import TAWactch.example.TAWatch.common.enums.PurposeType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OtpSendRequest(
        @NotBlank @Email(message = "EMAIL_VALID") String email,
        @NotNull PurposeType purpose
) {}
