package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.WatchRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.WatchResponse;
import TAWactch.example.TAWatch.service.WatchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watches")
public class WatchController {

    @Autowired
    private WatchService watchService;

    // GET /watches — lấy tất cả đồng hồ đang active (public)
    @GetMapping
    public ApiRespone<List<WatchResponse>> getAllWatches() {
        ApiRespone<List<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getAllWatches());
        return response;
    }

    // GET /watches/admin — lấy tất cả đồng hồ kể cả inactive (admin)
    @GetMapping("/admin")
    public ApiRespone<List<WatchResponse>> getAllWatchesAdmin() {
        ApiRespone<List<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getAllWatchesAdmin());
        return response;
    }

    // GET /watches/{id} — lấy đồng hồ theo id
    @GetMapping("/{id}")
    public ApiRespone<WatchResponse> getWatchById(@PathVariable int id) {
        ApiRespone<WatchResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getWatchById(id));
        return response;
    }

    // GET /watches/slug/{slug} — lấy đồng hồ theo slug
    @GetMapping("/slug/{slug}")
    public ApiRespone<WatchResponse> getWatchBySlug(@PathVariable String slug) {
        ApiRespone<WatchResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getWatchBySlug(slug));
        return response;
    }

    // POST /watches — tạo đồng hồ mới
    @PostMapping
    public ApiRespone<WatchResponse> createWatch(@Valid @RequestBody WatchRequest request) {
        ApiRespone<WatchResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao dong ho thanh cong");
        response.setData(watchService.createWatch(request));
        return response;
    }

    // PUT /watches/{id} — cập nhật đồng hồ
    @PutMapping("/{id}")
    public ApiRespone<WatchResponse> updateWatch(@PathVariable int id, @Valid @RequestBody WatchRequest request) {
        ApiRespone<WatchResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat dong ho thanh cong");
        response.setData(watchService.updateWatch(id, request));
        return response;
    }

    // PATCH /watches/{id}/status — bật/tắt trạng thái bán
    @PatchMapping("/{id}/status")
    public ApiRespone<WatchResponse> updateWatchStatus(@PathVariable int id, @RequestBody java.util.Map<String, Boolean> body) {
        Boolean isActive = body.get("isActive");
        ApiRespone<WatchResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat trang thai thanh cong");
        response.setData(watchService.updateWatchStatus(id, isActive));
        return response;
    }

    // DELETE /watches/{id} — xóa đồng hồ
    @DeleteMapping("/{id}")
    public ApiRespone<Void> deleteWatch(@PathVariable int id) {
        watchService.deleteWatch(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa dong ho thanh cong");
        return response;
    }
}
