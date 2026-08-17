package TAWactch.example.TAWatch.review.controller;

import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.review.dto.request.ReviewRequest;
import TAWactch.example.TAWatch.review.dto.response.ReviewResponse;
import TAWactch.example.TAWatch.review.service.ReviewService;
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
    public ApiResponse<List<ReviewResponse>> getAll(@RequestParam(required = false) Boolean isApproved) {
        ApiResponse<List<ReviewResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getAll(isApproved));
        return response;
    }

    // Public: lấy review theo đồng hồ — ?watchId={id}&isApproved=true
    @GetMapping("/watch/{watchId}")
    public ApiResponse<List<ReviewResponse>> getByWatch(
            @PathVariable Integer watchId,
            @RequestParam(required = false) Boolean isApproved) {
        ApiResponse<List<ReviewResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getByWatch(watchId, isApproved));
        return response;
    }

    // User: lấy review của chính mình
    @GetMapping("/user/{userId}")
    public ApiResponse<List<ReviewResponse>> getByUser(@PathVariable Integer userId) {
        ApiResponse<List<ReviewResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getByUser(userId));
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<ReviewResponse> getById(@PathVariable int id) {
        ApiResponse<ReviewResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(reviewService.getById(id));
        return response;
    }

    @PostMapping
    public ApiResponse<ReviewResponse> create(@Valid @RequestBody ReviewRequest request) {
        ApiResponse<ReviewResponse> response = new ApiResponse<>();
        response.setCode(201);
        response.setMessage("Tao danh gia thanh cong, dang cho duyet");
        response.setData(reviewService.create(request));
        return response;
    }

    @PatchMapping("/{id}/approve")
    public ApiResponse<ReviewResponse> approve(@PathVariable int id) {
        ApiResponse<ReviewResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Duyet danh gia thanh cong");
        response.setData(reviewService.approve(id));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable int id) {
        reviewService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa danh gia thanh cong");
        return response;
    }
}
