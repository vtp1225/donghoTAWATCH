package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.List;

public record WatchVariantImageBatchRequest(
        @NotNull Integer variantId,
        @NotNull @Size(min = 1) List<@Valid WatchImageItemRequest> images
) implements Serializable {}
