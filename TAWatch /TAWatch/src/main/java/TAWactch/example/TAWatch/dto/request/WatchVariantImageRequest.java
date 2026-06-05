package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record WatchVariantImageRequest(
        @NotNull Integer variantId,
        @NotNull @Size(max = 500) String url,
        @Size(max = 255) String altText,
        Boolean isPrimary,
        Boolean isMainImage,
        Integer sortOrder
) implements Serializable {}
