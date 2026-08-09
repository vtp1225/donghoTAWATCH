package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.RoleType;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(@NotNull RoleType role) {}
