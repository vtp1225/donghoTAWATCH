package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.CouponRequest;
import TAWactch.example.TAWatch.dto.request.CouponValidateRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.CouponResponse;
import TAWactch.example.TAWatch.dto.respone.CouponValidateResponse;
import TAWactch.example.TAWatch.service.CouponService;
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
    public ApiRespone<List<CouponResponse>> getAll(
            @RequestParam(required = false) Integer promotionId,
            @RequestParam(required = false) Boolean isUsed) {
        ApiRespone<List<CouponResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getAll(promotionId, isUsed));
        return response;
    }

    @GetMapping("/featured")
    public ApiRespone<List<CouponResponse>> getFeatured() {
        ApiRespone<List<CouponResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getFeatured());
        return response;
    }

    @GetMapping("/{id}")
    public ApiRespone<CouponResponse> getById(@PathVariable int id) {
        ApiRespone<CouponResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(couponService.getById(id));
        return response;
    }

    @PostMapping
    public ApiRespone<CouponResponse> create(@Valid @RequestBody CouponRequest request) {
        ApiRespone<CouponResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao coupon thanh cong");
        response.setData(couponService.create(request));
        return response;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable int id) {
        couponService.delete(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa coupon thanh cong");
        return response;
    }

    @PostMapping("/validate")
    public ApiRespone<CouponValidateResponse> validate(@Valid @RequestBody CouponValidateRequest request) {
        ApiRespone<CouponValidateResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Coupon hop le");
        response.setData(couponService.validate(request));
        return response;
    }
}
