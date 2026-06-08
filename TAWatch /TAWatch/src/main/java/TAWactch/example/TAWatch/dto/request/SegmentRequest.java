package TAWactch.example.TAWatch.dto.request;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record SegmentRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 120) String slug,
        @NotNull DeliveryMethodType deliveryMethod
) implements Serializable {}
