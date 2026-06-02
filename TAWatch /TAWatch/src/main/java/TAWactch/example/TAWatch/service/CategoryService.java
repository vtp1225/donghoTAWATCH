package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.CategoryRequest;
import TAWactch.example.TAWatch.dto.respone.CategoryResponse;
import TAWactch.example.TAWatch.entity.Category;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.CategoryMapper;
import TAWactch.example.TAWatch.repository.CategoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Autowired
    private CategoryMapper categoryMapper;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepo.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    public List<CategoryResponse> getCategoryTree() {
        return categoryRepo.findAllRootCategories().stream()
                .map(c -> categoryMapper.toResponse(c, true))
                .toList();
    }

    public CategoryResponse getCategoryById(int id) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepo.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        if (categoryRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }
        if (categoryRepo.existsBySlug(request.slug())) {
            throw new AppException(ErrorCode.CATEGORY_SLUG_EXISTS);
        }

        Category category = new Category();
        category.setName(request.name());
        category.setSlug(request.slug());

        if (request.parentId() != null) {
            Category parent = categoryRepo.findById(request.parentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            category.setParent(parent);
        }

        return categoryMapper.toResponse(categoryRepo.save(category));
    }

    public CategoryResponse updateCategory(int id, CategoryRequest request) {
        Category category = categoryRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (categoryRepo.existsByNameAndIdNot(request.name(), id)) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }
        if (categoryRepo.existsBySlugAndIdNot(request.slug(), id)) {
            throw new AppException(ErrorCode.CATEGORY_SLUG_EXISTS);
        }

        if (request.parentId() != null) {
            if (request.parentId().equals(id)) {
                throw new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
            }
            Category parent = categoryRepo.findById(request.parentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            if (isDescendant(id, parent)) {
                throw new AppException(ErrorCode.CATEGORY_CIRCULAR_REFERENCE);
            }
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        category.setName(request.name());
        category.setSlug(request.slug());

        return categoryMapper.toResponse(categoryRepo.save(category));
    }

    public void deleteCategory(int id) {
        if (!categoryRepo.existsById(id)) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }
        categoryRepo.deleteById(id);
    }

    // Kiểm tra xem candidate có phải là con (bậc bất kỳ) của targetId không
    private boolean isDescendant(int targetId, Category candidate) {
        Category current = candidate.getParent();
        while (current != null) {
            if (current.getId().equals(targetId)) return true;
            current = current.getParent();
        }
        return false;
    }
}
