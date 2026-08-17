package TAWactch.example.TAWatch.order.dto.request;

import TAWactch.example.TAWatch.common.enums.OrderStatusType;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(
        @NotNull OrderStatusType newStatus,
        Integer changedByUserId,
        String note
) {}
