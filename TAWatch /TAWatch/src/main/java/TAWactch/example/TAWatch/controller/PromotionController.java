package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.PromotionRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.PromotionResponse;
import TAWactch.example.TAWatch.service.PromotionService;
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
    public ApiRespone<List<PromotionResponse>> getAll(@RequestParam(required = false) Boolean isActive) {
        ApiRespone<List<PromotionResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(promotionService.getAll(isActive));
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<PromotionResponse> getById(@PathVariable int id) {
        ApiRespone<PromotionResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(promotionService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<PromotionResponse> create(@Valid @RequestBody PromotionRequest request) {
        ApiRespone<PromotionResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao chuong trinh khuyen mai thanh cong");
        response.setData(promotionService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<PromotionResponse> update(@PathVariable int id, @Valid @RequestBody PromotionRequest request) {
        ApiRespone<PromotionResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat chuong trinh khuyen mai thanh cong");
        response.setData(promotionService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        promotionService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa chuong trinh khuyen mai thanh cong");
        return response;
    }
}
