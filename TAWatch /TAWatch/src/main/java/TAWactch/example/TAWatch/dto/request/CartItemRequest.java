package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        @NotNull Integer watchVariantId,
        @NotNull @Min(1) Integer quantity
) {}
