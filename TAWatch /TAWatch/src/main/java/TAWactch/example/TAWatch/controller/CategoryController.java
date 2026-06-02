package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.CategoryRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.CategoryResponse;
import TAWactch.example.TAWatch.service.CategoryService;
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
    public ApiRespone<List<CategoryResponse>> getAllCategories() {
        ApiRespone<List<CategoryResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getAllCategories());
        return response;
    }

    @GetMapping("/tree")
    public ApiRespone<List<CategoryResponse>> getCategoryTree() {
        ApiRespone<List<CategoryResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getCategoryTree());
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<CategoryResponse> getCategoryById(@PathVariable int id) {
        ApiRespone<CategoryResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getCategoryById(id));
        return response;
    }

    @GetMapping("/slug/{slug}")
    public ApiRespone<CategoryResponse> getCategoryBySlug(@PathVariable String slug) {
        ApiRespone<CategoryResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(categoryService.getCategoryBySlug(slug));
        return response;
    }

    @PostMapping
    public ApiRespone<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        ApiRespone<CategoryResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao danh muc thanh cong");
        response.setData(categoryService.createCategory(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<CategoryResponse> updateCategory(@PathVariable int id, @Valid @RequestBody CategoryRequest request) {
        ApiRespone<CategoryResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat danh muc thanh cong");
        response.setData(categoryService.updateCategory(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> deleteCategory(@PathVariable int id) {
        categoryService.deleteCategory(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa danh muc thanh cong");
        return response;
    }
}
