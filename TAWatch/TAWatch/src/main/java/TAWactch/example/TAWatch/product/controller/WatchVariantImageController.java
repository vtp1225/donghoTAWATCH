package TAWactch.example.TAWatch.product.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.product.dto.request.WatchImageReorderRequest;
import TAWactch.example.TAWatch.product.dto.request.WatchVariantImageBatchRequest;
import TAWactch.example.TAWatch.product.dto.request.WatchVariantImageRequest;
import TAWactch.example.TAWatch.product.dto.response.WatchVariantImageResponse;
import TAWactch.example.TAWatch.product.service.WatchVariantImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/watch-variant-images")
public class WatchVariantImageController {

    @Autowired
    private WatchVariantImageService variantImageService;

    @GetMapping
    public ApiResponse<List<WatchVariantImageResponse>> getAllByVariantId(@RequestParam int variantId) {
        ApiResponse<List<WatchVariantImageResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(variantImageService.getAllByVariantId(variantId));
        return response;
    }

    @GetMapping("/main")
    public ApiResponse<WatchVariantImageResponse> getMainImage(@RequestParam int watchId) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(variantImageService.getMainImageByWatchId(watchId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<WatchVariantImageResponse> getById(@PathVariable int id) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(variantImageService.getById(id));
        return response;
    }

    @PostMapping("/upload")
    @LogAdminActivity(action = "CREATE", tableName = "watch_variant_images")
    public ApiResponse<WatchVariantImageResponse> upload(
            @RequestParam MultipartFile file,
            @RequestParam Integer variantId,
            @RequestParam(required = false) String altText,
            @RequestParam(required = false) Boolean isPrimary,
            @RequestParam(required = false) Boolean isMainImage,
            @RequestParam(required = false) Integer sortOrder) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Upload anh bien the thanh cong");
        response.setData(variantImageService.uploadAndCreate(file, variantId, altText, isPrimary, isMainImage, sortOrder));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "watch_variant_images")
    public ApiResponse<WatchVariantImageResponse> create(@Valid @RequestBody WatchVariantImageRequest request) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao anh bien the thanh cong");
        response.setData(variantImageService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "watch_variant_images")
    public ApiResponse<WatchVariantImageResponse> update(@PathVariable int id, @Valid @RequestBody WatchVariantImageRequest request) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat anh bien the thanh cong");
        response.setData(variantImageService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "watch_variant_images")
    public ApiResponse<Void> delete(@PathVariable int id) {
        variantImageService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa anh bien the thanh cong");
        return response;
    }

    @PatchMapping("/{id}/set-primary")
    @LogAdminActivity(action = "UPDATE", tableName = "watch_variant_images")
    public ApiResponse<WatchVariantImageResponse> setPrimary(@PathVariable int id) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Dat anh chinh bien the thanh cong");
        response.setData(variantImageService.setPrimary(id));
        return response;
    }

    @PatchMapping("/{id}/set-main-image")
    @LogAdminActivity(action = "UPDATE", tableName = "watch_variant_images")
    public ApiResponse<WatchVariantImageResponse> setMainImage(@PathVariable int id) {
        ApiResponse<WatchVariantImageResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Dat anh dai dien san pham thanh cong");
        response.setData(variantImageService.setMainImage(id));
        return response;
    }

    @PostMapping("/batch")
    @LogAdminActivity(action = "CREATE", tableName = "watch_variant_images")
    public ApiResponse<List<WatchVariantImageResponse>> batchCreate(@Valid @RequestBody WatchVariantImageBatchRequest request) {
        ApiResponse<List<WatchVariantImageResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao nhieu anh bien the thanh cong");
        response.setData(variantImageService.batchCreate(request));
        return response;
    }

    @PatchMapping("/reorder")
    @LogAdminActivity(action = "UPDATE", tableName = "watch_variant_images")
    public ApiResponse<List<WatchVariantImageResponse>> reorder(@Valid @RequestBody WatchImageReorderRequest request) {
        ApiResponse<List<WatchVariantImageResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat thu tu anh bien the thanh cong");
        response.setData(variantImageService.reorder(request));
        return response;
    }

    @DeleteMapping("/variant/{variantId}")
    @LogAdminActivity(action = "DELETE", tableName = "watch_variant_images")
    public ApiResponse<Void> deleteAllByVariantId(@PathVariable int variantId) {
        variantImageService.deleteAllByVariantId(variantId);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa tat ca anh bien the thanh cong");
        return response;
    }
}
