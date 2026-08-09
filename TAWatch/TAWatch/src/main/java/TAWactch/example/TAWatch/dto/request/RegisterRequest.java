package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record RegisterRequest(
        @Size(max = 80) String username,
        @NotBlank @Size(max = 150) @Email(message = "EMAIL_VALID") String email,
        @NotBlank @Size(min = 6, message = "PASSWORD_VALID") String password,
        @Size(max = 200) String fullName,
        @Size(max = 20) String phone,
        LocalDate birthday
) {}
