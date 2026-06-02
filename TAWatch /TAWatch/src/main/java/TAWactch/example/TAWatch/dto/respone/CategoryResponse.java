package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;
import java.util.List;

public record CategoryResponse(
        Integer id,
        String name,
        String slug,
        Integer parentId,
        String parentName,
        List<CategoryResponse> children
) implements Serializable {}
