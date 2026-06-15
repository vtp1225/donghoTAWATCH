package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.ReviewRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.ReviewResponse;
import TAWactch.example.TAWatch.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Admin: lấy tất cả review, có thể lọc ?isApproved=true/false
    @GetMapping
    public ApiRespone<List<ReviewResponse>> getAll(@RequestParam(required = false) Boolean isApproved) {
        ApiRespone<List<ReviewResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getAll(isApproved));
        return response;
    }

    // Public: lấy review theo đồng hồ — ?watchId={id}&isApproved=true
    @GetMapping("/watch/{watchId}")
    public ApiRespone<List<ReviewResponse>> getByWatch(
            @PathVariable Integer watchId,
            @RequestParam(required = false) Boolean isApproved) {
        ApiRespone<List<ReviewResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getByWatch(watchId, isApproved));
        return response;
    }

    // User: lấy review của chính mình
    @GetMapping("/user/{userId}")
    public ApiRespone<List<ReviewResponse>> getByUser(@PathVariable Integer userId) {
        ApiRespone<List<ReviewResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getByUser(userId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<ReviewResponse> getById(@PathVariable int id) {
        ApiRespone<ReviewResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<ReviewResponse> create(@Valid @RequestBody ReviewRequest request) {
        ApiRespone<ReviewResponse> response = new ApiRespone<>();
        response.setCode(201);
        response.setMessage("Tao danh gia thanh cong, dang cho duyet");
        response.setData(reviewService.create(request));
        return response;
    }

    @PatchMapping("/{id}/approve")
    public ApiRespone<ReviewResponse> approve(@PathVariable int id) {
        ApiRespone<ReviewResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Duyet danh gia thanh cong");
        response.setData(reviewService.approve(id));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        reviewService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa danh gia thanh cong");
        return response;
    }
}
