package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.SegmentRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.SegmentResponse;
import TAWactch.example.TAWatch.service.SegmentService;
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
    public ApiRespone<List<SegmentResponse>> getAllSegments() {
        ApiRespone<List<SegmentResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(segmentService.getAllSegments());
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<SegmentResponse> getSegmentById(@PathVariable int id) {
        ApiRespone<SegmentResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(segmentService.getSegmentById(id));
        return response;
    }

    @GetMapping("/slug/{slug}")
    public ApiRespone<SegmentResponse> getSegmentBySlug(@PathVariable String slug) {
        ApiRespone<SegmentResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(segmentService.getSegmentBySlug(slug));
        return response;
    }

    @PostMapping
    public ApiRespone<SegmentResponse> createSegment(@Valid @RequestBody SegmentRequest request) {
        ApiRespone<SegmentResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao phan khuc thanh cong");
        response.setData(segmentService.createSegment(request));
        return response;
    }

    @PutMapping("/{id}")
    public ApiRespone<SegmentResponse> updateSegment(@PathVariable int id, @Valid @RequestBody SegmentRequest request) {
        ApiRespone<SegmentResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Cap nhat phan khuc thanh cong");
        response.setData(segmentService.updateSegment(id, request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> deleteSegment(@PathVariable int id) {
        segmentService.deleteSegment(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa phan khuc thanh cong");
        return response;
    }
}
