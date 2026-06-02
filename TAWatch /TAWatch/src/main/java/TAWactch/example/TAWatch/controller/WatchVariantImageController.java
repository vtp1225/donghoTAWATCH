package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.WatchImageReorderRequest;
import TAWactch.example.TAWatch.dto.request.WatchVariantImageBatchRequest;
import TAWactch.example.TAWatch.dto.request.WatchVariantImageRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.WatchVariantImageResponse;
import TAWactch.example.TAWatch.service.WatchVariantImageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watch-variant-images")
public class WatchVariantImageController {

    @Autowired
    private WatchVariantImageService variantImageService;

    @GetMapping
    public ApiRespone<List<WatchVariantImageResponse>> getAllByVariantId(@RequestParam int variantId) {
        ApiRespone<List<WatchVariantImageResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(variantImageService.getAllByVariantId(variantId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<WatchVariantImageResponse> getById(@PathVariable int id) {
        ApiRespone<WatchVariantImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(variantImageService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<WatchVariantImageResponse> create(@Valid @RequestBody WatchVariantImageRequest request) {
        ApiRespone<WatchVariantImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao anh bien the thanh cong");
        response.setData(variantImageService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<WatchVariantImageResponse> update(@PathVariable int id, @Valid @RequestBody WatchVariantImageRequest request) {
        ApiRespone<WatchVariantImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat anh bien the thanh cong");
        response.setData(variantImageService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        variantImageService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa anh bien the thanh cong");
        return response;
    }

    @PatchMapping("/{id}/set-primary")
    public ApiRespone<WatchVariantImageResponse> setPrimary(@PathVariable int id) {
        ApiRespone<WatchVariantImageResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Dat anh chinh bien the thanh cong");
        response.setData(variantImageService.setPrimary(id));
        return response;
    }

    @PostMapping("/batch")
    public ApiRespone<List<WatchVariantImageResponse>> batchCreate(@Valid @RequestBody WatchVariantImageBatchRequest request) {
        ApiRespone<List<WatchVariantImageResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao nhieu anh bien the thanh cong");
        response.setData(variantImageService.batchCreate(request));
        return response;
    }

    @PatchMapping("/reorder")
    public ApiRespone<List<WatchVariantImageResponse>> reorder(@Valid @RequestBody WatchImageReorderRequest request) {
        ApiRespone<List<WatchVariantImageResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat thu tu anh bien the thanh cong");
        response.setData(variantImageService.reorder(request));
        return response;
    }

    @DeleteMapping("/variant/{variantId}")
    public ApiRespone<Void> deleteAllByVariantId(@PathVariable int variantId) {
        variantImageService.deleteAllByVariantId(variantId);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa tat ca anh bien the thanh cong");
        return response;
    }
}
