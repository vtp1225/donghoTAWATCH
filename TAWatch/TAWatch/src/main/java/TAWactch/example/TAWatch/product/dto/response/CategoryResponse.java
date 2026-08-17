package TAWactch.example.TAWatch.product.dto.response;

import java.io.Serializable;
import java.util.List;

public record CategoryResponse(
        Integer id,
        String name,
        String slug,
        Integer parentId,
        String parentName,
        Boolean isActive,
        List<CategoryResponse> children
) implements Serializable {}
