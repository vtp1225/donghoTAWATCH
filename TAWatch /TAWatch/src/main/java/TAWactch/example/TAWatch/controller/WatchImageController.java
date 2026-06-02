package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.WatchImageBatchRequest;
import TAWactch.example.TAWatch.dto.request.WatchImageReorderRequest;
import TAWactch.example.TAWatch.dto.request.WatchImageRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.WatchImageResponse;
import TAWactch.example.TAWatch.service.WatchImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watch-images")
public class WatchImageController {

    @Autowired
    private WatchImageService watchImageService;

    @GetMapping
    public ApiRespone<List<WatchImageResponse>> getAllByWatchId(@RequestParam int watchId) {
        ApiRespone<List<WatchImageResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchImageService.getAllByWatchId(watchId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<WatchImageResponse> getById(@PathVariable int id) {
        ApiRespone<WatchImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchImageService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<WatchImageResponse> create(@Valid @RequestBody WatchImageRequest request) {
        ApiRespone<WatchImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao anh dong ho thanh cong");
        response.setData(watchImageService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<WatchImageResponse> update(@PathVariable int id, @Valid @RequestBody WatchImageRequest request) {
        ApiRespone<WatchImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat anh dong ho thanh cong");
        response.setData(watchImageService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        watchImageService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa anh dong ho thanh cong");
        return response;
    }

    @PatchMapping("/{id}/set-primary")
    public ApiRespone<WatchImageResponse> setPrimary(@PathVariable int id) {
        ApiRespone<WatchImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Dat anh chinh thanh cong");
        response.setData(watchImageService.setPrimary(id));
        return response;
    }

    @PostMapping("/batch")
    public ApiRespone<List<WatchImageResponse>> batchCreate(@Valid @RequestBody WatchImageBatchRequest request) {
        ApiRespone<List<WatchImageResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao nhieu anh dong ho thanh cong");
        response.setData(watchImageService.batchCreate(request));
        return response;
    }

    @PatchMapping("/reorder")
    public ApiRespone<List<WatchImageResponse>> reorder(@Valid @RequestBody WatchImageReorderRequest request) {
        ApiRespone<List<WatchImageResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat thu tu anh thanh cong");
        response.setData(watchImageService.reorder(request));
        return response;
    }

    @DeleteMapping("/watch/{watchId}")
    public ApiRespone<Void> deleteAllByWatchId(@PathVariable int watchId) {
        watchImageService.deleteAllByWatchId(watchId);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa tat ca anh dong ho thanh cong");
        return response;
    }
}
