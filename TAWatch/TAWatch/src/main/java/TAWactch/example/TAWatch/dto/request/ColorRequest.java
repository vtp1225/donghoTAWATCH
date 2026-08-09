package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ColorRequest(
        @NotNull @Size(max = 80) String name,
        @Size(max = 10) @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
                message = "hexCode phai co dinh dang #RRGGBB hoac #RGB") String hexCode,
        Boolean isActive
) {}
