package TAWactch.example.TAWatch.product.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.product.dto.request.ColorRequest;
import TAWactch.example.TAWatch.product.dto.response.ColorResponse;
import TAWactch.example.TAWatch.product.service.ColorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colors")
public class ColorController {

    @Autowired
    private ColorService colorService;

    // Public: lấy tất cả màu, ?isActive=true để chỉ lấy màu đang dùng
    @GetMapping
    public ApiResponse<List<ColorResponse>> getAll(@RequestParam(required = false) Boolean isActive) {
        ApiResponse<List<ColorResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(colorService.getAll(isActive));
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<ColorResponse> getById(@PathVariable int id) {
        ApiResponse<ColorResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(colorService.getById(id));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "colors")
    public ApiResponse<ColorResponse> create(@Valid @RequestBody ColorRequest request) {
        ApiResponse<ColorResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao mau thanh cong");
        response.setData(colorService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "colors")
    public ApiResponse<ColorResponse> update(@PathVariable int id, @Valid @RequestBody ColorRequest request) {
        ApiResponse<ColorResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat mau thanh cong");
        response.setData(colorService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "colors")
    public ApiResponse<Void> delete(@PathVariable int id) {
        colorService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa mau thanh cong");
        return response;
    }
}
