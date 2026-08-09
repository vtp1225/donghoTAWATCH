package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.AuthProviderType;
import TAWactch.example.TAWatch.Enum.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

/**
 * DTO for {@link TAWactch.example.TAWatch.entity.User}
 * passwordHash excluded intentionally — never expose hashed passwords in responses.
 */
public record UserRespone(
        Integer id,
        @Size(max = 80) String username,
        @NotNull @Size(max = 150) @Email(message = "EMAIL_VALID") String email,
        @Size(max = 200) String fullName,
        @Size(max = 20) String phone,
        LocalDate birthday,
        @NotNull AuthProviderType authProvider,
        @NotNull RoleType role,
        @NotNull Integer loyaltyPoints,
        @NotNull Boolean isActive,
        @NotNull Boolean isVerified,
        @NotNull Instant createdAt,
        @NotNull Instant updatedAt
) implements Serializable {}
