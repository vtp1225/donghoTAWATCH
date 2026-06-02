package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

public record CategoryRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 200) String slug,
        Integer parentId
) implements Serializable {}
