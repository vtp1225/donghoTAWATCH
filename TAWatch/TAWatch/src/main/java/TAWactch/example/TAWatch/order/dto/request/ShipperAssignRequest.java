package TAWactch.example.TAWatch.order.dto.request;

import jakarta.validation.constraints.NotNull;

public record ShipperAssignRequest(
        @NotNull Integer shipperId
) {}
