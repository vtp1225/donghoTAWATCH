package TAWactch.example.TAWatch.product.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.product.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.product.dto.response.SegmentResponse;
import TAWactch.example.TAWatch.product.service.SegmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/segments")
public class SegmentController {

    @Autowired
    private SegmentService segmentService;

    @GetMapping
    public ApiResponse<List<SegmentResponse>> getAllSegments() {
        ApiResponse<List<SegmentResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(segmentService.getAllSegments());
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<SegmentResponse> getSegmentById(@PathVariable int id) {
        ApiResponse<SegmentResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(segmentService.getSegmentById(id));
        return response;
    }

    @GetMapping("/slug/{slug}")
    public ApiResponse<SegmentResponse> getSegmentBySlug(@PathVariable String slug) {
        ApiResponse<SegmentResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(segmentService.getSegmentBySlug(slug));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "segments")
    public ApiResponse<SegmentResponse> createSegment(@Valid @RequestBody SegmentRequest request) {
        ApiResponse<SegmentResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao phan khuc thanh cong");
        response.setData(segmentService.createSegment(request));
        return response;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "segments")
    public ApiResponse<SegmentResponse> updateSegment(@PathVariable int id, @Valid @RequestBody SegmentRequest request) {
        ApiResponse<SegmentResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat phan khuc thanh cong");
        response.setData(segmentService.updateSegment(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "segments")
    public ApiResponse<Void> deleteSegment(@PathVariable int id) {
        segmentService.deleteSegment(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa phan khuc thanh cong");
        return response;
    }
}
