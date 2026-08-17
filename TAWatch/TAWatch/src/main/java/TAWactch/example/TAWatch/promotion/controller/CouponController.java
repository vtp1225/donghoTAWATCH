package TAWactch.example.TAWatch.promotion.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.promotion.dto.request.CouponRequest;
import TAWactch.example.TAWatch.promotion.dto.request.CouponValidateRequest;
import TAWactch.example.TAWatch.promotion.dto.response.CouponResponse;
import TAWactch.example.TAWatch.promotion.dto.response.CouponValidateResponse;
import TAWactch.example.TAWatch.promotion.service.CouponService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/coupons")
public class CouponController {

    @Autowired
    private CouponService couponService;

    @GetMapping
    public ApiResponse<List<CouponResponse>> getAll(
            @RequestParam(required = false) Integer promotionId,
            @RequestParam(required = false) Boolean isUsed) {
        ApiResponse<List<CouponResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getAll(promotionId, isUsed));
        return response;
    }

    @GetMapping("/featured")
    public ApiResponse<List<CouponResponse>> getFeatured() {
        ApiResponse<List<CouponResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getFeatured());
        return response;
    }

    @GetMapping("/{id}")
    public ApiResponse<CouponResponse> getById(@PathVariable int id) {
        ApiResponse<CouponResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getById(id));
        return response;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "coupons")
    public ApiResponse<CouponResponse> create(@Valid @RequestBody CouponRequest request) {
        ApiResponse<CouponResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao coupon thanh cong");
        response.setData(couponService.create(request));
        return response;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "coupons")
    public ApiResponse<Void> delete(@PathVariable int id) {
        couponService.delete(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa coupon thanh cong");
        return response;
    }

    @PostMapping("/validate")
    public ApiResponse<CouponValidateResponse> validate(@Valid @RequestBody CouponValidateRequest request) {
        ApiResponse<CouponValidateResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Coupon hop le");
        response.setData(couponService.validate(request));
        return response;
    }

    @GetMapping("/my-coupons")
    public ApiResponse<List<CouponResponse>> getMyCoupons(@RequestAttribute("userId") int userId) {
        ApiResponse<List<CouponResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getMyCoupons(userId));
        return response;
    }
}
