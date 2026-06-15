package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.ColorRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.ColorResponse;
import TAWactch.example.TAWatch.service.ColorService;
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
    public ApiRespone<List<ColorResponse>> getAll(@RequestParam(required = false) Boolean isActive) {
        ApiRespone<List<ColorResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(colorService.getAll(isActive));
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<ColorResponse> getById(@PathVariable int id) {
        ApiRespone<ColorResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(colorService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<ColorResponse> create(@Valid @RequestBody ColorRequest request) {
        ApiRespone<ColorResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao mau thanh cong");
        response.setData(colorService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<ColorResponse> update(@PathVariable int id, @Valid @RequestBody ColorRequest request) {
        ApiRespone<ColorResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat mau thanh cong");
        response.setData(colorService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        colorService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa mau thanh cong");
        return response;
    }
}
