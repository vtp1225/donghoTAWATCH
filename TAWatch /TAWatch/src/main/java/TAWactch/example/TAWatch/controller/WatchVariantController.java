package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.WatchVariantRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.WatchVariantResponse;
import TAWactch.example.TAWatch.service.WatchVariantService;
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
    public ApiRespone<List<WatchVariantResponse>> getAllByWatchId(@RequestParam int watchId) {
        ApiRespone<List<WatchVariantResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchVariantService.getAllByWatchId(watchId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<WatchVariantResponse> getById(@PathVariable int id) {
        ApiRespone<WatchVariantResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(watchVariantService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<WatchVariantResponse> create(@Valid @RequestBody WatchVariantRequest request) {
        ApiRespone<WatchVariantResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao bien the dong ho thanh cong");
        response.setData(watchVariantService.create(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<WatchVariantResponse> update(@PathVariable int id, @Valid @RequestBody WatchVariantRequest request) {
        ApiRespone<WatchVariantResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat bien the dong ho thanh cong");
        response.setData(watchVariantService.update(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        watchVariantService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa bien the dong ho thanh cong");
        return response;
    }
}
