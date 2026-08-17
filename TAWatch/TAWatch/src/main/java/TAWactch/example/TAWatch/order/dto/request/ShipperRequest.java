package TAWactch.example.TAWatch.order.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ShipperRequest(
        @NotBlank String name,
        String apiEndpoint,
        String apiKey,
        Boolean isActive
) {}
