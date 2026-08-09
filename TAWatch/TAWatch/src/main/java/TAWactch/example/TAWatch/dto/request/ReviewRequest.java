package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
        @NotNull Integer userId,
        @NotNull Integer watchId,
        @NotNull Integer orderId,
        @NotNull @Min(1) @Max(5) Integer rating,
        String comment
) {}
