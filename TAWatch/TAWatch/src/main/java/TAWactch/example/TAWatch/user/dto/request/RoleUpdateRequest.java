package TAWactch.example.TAWatch.user.dto.request;

import TAWactch.example.TAWatch.common.enums.RoleType;
import jakarta.validation.constraints.NotNull;

public record RoleUpdateRequest(@NotNull RoleType role) {}
