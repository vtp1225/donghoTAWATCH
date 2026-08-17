package TAWactch.example.TAWatch.product.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.product.dto.request.WatchVariantRequest;
import TAWactch.example.TAWatch.product.dto.response.WatchVariantResponse;
import TAWactch.example.TAWatch.product.service.WatchVariantService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watch-variants")
public class WatchVariantController {

    @Autowired
    private WatchVariantService watchVariantService;

    @GetMapping
    public ApiResponse<List<WatchVariantResponse>> getAllByWatchId(@RequestParam int watchId) {
        ApiResponse<List<WatchVariantResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchVariantService.getAllByWatchId(watchId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<WatchVariantResponse> getById(@PathVariable int id) {
        ApiResponse<WatchVariantResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchVariantService.getById(id));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "watch_variants")
    public ApiResponse<WatchVariantResponse> create(@Valid @RequestBody WatchVariantRequest request) {
        ApiResponse<WatchVariantResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao bien the dong ho thanh cong");
        response.setData(watchVariantService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "watch_variants")
    public ApiResponse<WatchVariantResponse> update(@PathVariable int id, @Valid @RequestBody WatchVariantRequest request) {
        ApiResponse<WatchVariantResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat bien the dong ho thanh cong");
        response.setData(watchVariantService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "watch_variants")
    public ApiResponse<Void> delete(@PathVariable int id) {
        watchVariantService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa bien the dong ho thanh cong");
        return response;
    }
}
