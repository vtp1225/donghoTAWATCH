package TAWactch.example.TAWatch.product.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.product.dto.request.BrandRequest;
import TAWactch.example.TAWatch.product.dto.response.BrandResponse;
import TAWactch.example.TAWatch.product.service.BrandService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    @GetMapping
    public ApiResponse<List<BrandResponse>> getAllBrands() {
        ApiResponse<List<BrandResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(brandService.getAllBrands());
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<BrandResponse> getBrandById(@PathVariable int id) {
        ApiResponse<BrandResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(brandService.getBrandById(id));
        return response;
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<BrandResponse> getBrandBySlug(@PathVariable String slug) {
        ApiResponse<BrandResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(brandService.getBrandBySlug(slug));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "brand")
    public ApiResponse<BrandResponse> createBrand(@Valid @RequestBody BrandRequest request) {
        ApiResponse<BrandResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao thuong hieu thanh cong");
        response.setData(brandService.createBrand(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "brand")
    public ApiResponse<BrandResponse> updateBrand(@PathVariable int id, @Valid @RequestBody BrandRequest request) {
        ApiResponse<BrandResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat thuong hieu thanh cong");
        response.setData(brandService.updateBrand(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "brand")
    public ApiResponse<Void> deleteBrand(@PathVariable int id) {
        brandService.deleteBrand(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa thuong hieu thanh cong");
        return response;
    }
}
