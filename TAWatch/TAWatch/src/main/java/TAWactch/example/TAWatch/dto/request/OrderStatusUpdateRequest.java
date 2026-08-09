package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.OrderStatusType;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
        @NotNull OrderStatusType newStatus,
        Integer changedByUserId,
        String note
) {}
