package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.AuthProviderType;
import TAWactch.example.TAWatch.Enum.RoleType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for {@link TAWactch.example.TAWatch.entity.User}
 */
public record UserRequest(@Size(max = 80) String username, @NotNull @Size(max = 150) @Email(message = "EMAIL_VALID") String email,
                          @Size(max = 255) String passwordHash, @Size(max = 200) String fullName,
                          @Size(max = 20) String phone, LocalDate birthday, @NotNull AuthProviderType authProvider,
                          @Size(max = 200) String googleId ) implements Serializable {
}