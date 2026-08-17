package TAWactch.example.TAWatch.promotion.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.promotion.dto.request.PromotionRequest;
import TAWactch.example.TAWatch.promotion.dto.response.PromotionResponse;
import TAWactch.example.TAWatch.promotion.service.PromotionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promotions")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

    @GetMapping
    public ApiResponse<List<PromotionResponse>> getAll(@RequestParam(required = false) Boolean isActive) {
        ApiResponse<List<PromotionResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(promotionService.getAll(isActive));
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<PromotionResponse> getById(@PathVariable int id) {
        ApiResponse<PromotionResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(promotionService.getById(id));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "promotions")
    public ApiResponse<PromotionResponse> create(@Valid @RequestBody PromotionRequest request) {
        ApiResponse<PromotionResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao chuong trinh khuyen mai thanh cong");
        response.setData(promotionService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "promotions")
    public ApiResponse<PromotionResponse> update(@PathVariable int id, @Valid @RequestBody PromotionRequest request) {
        ApiResponse<PromotionResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat chuong trinh khuyen mai thanh cong");
        response.setData(promotionService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "promotions")
    public ApiResponse<Void> delete(@PathVariable int id) {
        promotionService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa chuong trinh khuyen mai thanh cong");
        return response;
    }
}
