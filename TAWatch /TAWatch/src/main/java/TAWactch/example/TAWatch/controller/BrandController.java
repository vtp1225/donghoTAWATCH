package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.BrandRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.BrandResponse;
import TAWactch.example.TAWatch.service.BrandService;
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
    public ApiRespone<List<BrandResponse>> getAllBrands() {
        ApiRespone<List<BrandResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(brandService.getAllBrands());
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<BrandResponse> getBrandById(@PathVariable int id) {
        ApiRespone<BrandResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(brandService.getBrandById(id));
        return response;
    }

    @GetMapping("/slug/{slug}")
    public ApiRespone<BrandResponse> getBrandBySlug(@PathVariable String slug) {
        ApiRespone<BrandResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(brandService.getBrandBySlug(slug));
        return response;
    }

    @PostMapping
    public ApiRespone<BrandResponse> createBrand(@Valid @RequestBody BrandRequest request) {
        ApiRespone<BrandResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao thuong hieu thanh cong");
        response.setData(brandService.createBrand(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<BrandResponse> updateBrand(@PathVariable int id, @Valid @RequestBody BrandRequest request) {
        ApiRespone<BrandResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat thuong hieu thanh cong");
        response.setData(brandService.updateBrand(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> deleteBrand(@PathVariable int id) {
        brandService.deleteBrand(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa thuong hieu thanh cong");
        return response;
    }
}
