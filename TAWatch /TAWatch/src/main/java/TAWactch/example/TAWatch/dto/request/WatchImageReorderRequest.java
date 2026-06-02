package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.util.List;

public record WatchImageReorderRequest(
        @NotNull List<@Valid WatchImageReorderItem> orders
) implements Serializable {

    public record WatchImageReorderItem(
            @NotNull Integer id,
            @NotNull Integer sortOrder
    ) implements Serializable {}
}
