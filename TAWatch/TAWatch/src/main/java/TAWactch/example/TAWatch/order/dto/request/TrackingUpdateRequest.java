package TAWactch.example.TAWatch.order.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TrackingUpdateRequest(
        @NotBlank String trackingCode
) {}
