package TAWactch.example.TAWatch.product.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.product.dto.request.CategoryRequest;
import TAWactch.example.TAWatch.product.dto.response.CategoryResponse;
import TAWactch.example.TAWatch.product.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getAllCategories());
        return response;
    }

    @GetMapping("/tree")
    public ApiResponse<List<CategoryResponse>> getCategoryTree() {
        ApiResponse<List<CategoryResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getCategoryTree());
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<CategoryResponse> getCategoryById(@PathVariable int id) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getCategoryById(id));
        return response;
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<CategoryResponse> getCategoryBySlug(@PathVariable String slug) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getCategoryBySlug(slug));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "categories")
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao danh muc thanh cong");
        response.setData(categoryService.createCategory(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "categories")
    public ApiResponse<CategoryResponse> updateCategory(@PathVariable int id, @Valid @RequestBody CategoryRequest request) {
        ApiResponse<CategoryResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat danh muc thanh cong");
        response.setData(categoryService.updateCategory(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "categories")
    public ApiResponse<Void> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa danh muc thanh cong");
        return response;
    }
}
