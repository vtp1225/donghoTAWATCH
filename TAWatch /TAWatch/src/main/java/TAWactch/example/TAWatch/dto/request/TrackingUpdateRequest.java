package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TrackingUpdateRequest(
        @NotBlank String trackingCode
) {}
