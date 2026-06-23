package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.WatchFilterRequest;
import TAWactch.example.TAWatch.dto.request.WatchRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.PagedResponse;
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

    // GET /watches/by-ids?ids=1,2,3 — lấy đồng hồ theo danh sách ID (public)
    @GetMapping("/by-ids")
    public ApiRespone<List<WatchResponse>> getWatchesByIds(@RequestParam List<Integer> ids) {
        ApiRespone<List<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getWatchesByIds(ids));
        return response;
    }

    // POST /watches/search — filter server-side với phân trang (public)
    @PostMapping("/search")
    public ApiRespone<PagedResponse<WatchResponse>> searchWatches(@RequestBody WatchFilterRequest request) {
        ApiRespone<PagedResponse<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.searchPublic(request));
        return response;
    }

    // GET /watches/paged?page=0&size=12 — lấy đồng hồ phân trang (public)
    @GetMapping("/paged")
    public ApiRespone<PagedResponse<WatchResponse>> getWatchesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        ApiRespone<PagedResponse<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getWatchesPaged(page, size));
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

    // GET /watches/admin/paged?page=0&size=20&search=&brandId=&categoryId=&segmentId=&isActive=
    @GetMapping("/admin/paged")
    public ApiRespone<PagedResponse<WatchResponse>> getWatchesAdminPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer segmentId,
            @RequestParam(required = false) Boolean isActive) {
        ApiRespone<PagedResponse<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getWatchesAdminPaged(page, size, search, brandId, categoryId, segmentId, isActive));
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

    // GET /watches/featured — đồng hồ nổi bật (public)
    @GetMapping("/featured")
    public ApiRespone<List<WatchResponse>> getFeaturedWatches() {
        ApiRespone<List<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getFeaturedWatches());
        return response;
    }

    // GET /watches/newest?limit=8 — đồng hồ mới nhất (public)
    @GetMapping("/newest")
    public ApiRespone<List<WatchResponse>> getNewestWatches(@RequestParam(defaultValue = "8") int limit) {
        ApiRespone<List<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getNewestWatches(limit));
        return response;
    }

    // GET /watches/by-category/{categoryId}?limit=8 — đồng hồ theo danh mục (public)
    @GetMapping("/by-category/{categoryId}")
    public ApiRespone<List<WatchResponse>> getWatchesByCategory(
            @PathVariable int categoryId,
            @RequestParam(defaultValue = "8") int limit) {
        ApiRespone<List<WatchResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchService.getWatchesByCategory(categoryId, limit));
        return response;
    }

    // PATCH /watches/{id}/featured — bật/tắt nổi bật (ADMIN)
    @PatchMapping("/{id}/featured")
    public ApiRespone<WatchResponse> toggleFeatured(@PathVariable int id, @RequestBody java.util.Map<String, Boolean> body) {
        Boolean isFeatured = body.get("isFeatured");
        ApiRespone<WatchResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat trang thai noi bat thanh cong");
        response.setData(watchService.toggleFeatured(id, Boolean.TRUE.equals(isFeatured)));
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
