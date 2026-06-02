package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.respone.CategoryResponse;
import TAWactch.example.TAWatch.entity.Category;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class CategoryMapper {

    public CategoryResponse toResponse(Category category) {
        return toResponse(category, false);
    }

    public CategoryResponse toResponse(Category category, boolean includeChildren) {
        if (category == null) return null;

        Integer parentId = category.getParent() != null ? category.getParent().getId() : null;
        String parentName = category.getParent() != null ? category.getParent().getName() : null;

        List<CategoryResponse> children = includeChildren && category.getChildren() != null
                ? category.getChildren().stream().map(c -> toResponse(c, true)).toList()
                : Collections.emptyList();

        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                parentId,
                parentName,
                children
        );
    }
}
