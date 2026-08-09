package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record BrandRequest(
        @NotNull @Size(max = 100) String name,
        @Size(max = 150) String slug,
        @Size(max = 100) String country,
        String description,
        @Size(max = 500) String logoUrl,
        Boolean isActive
) implements Serializable {}
