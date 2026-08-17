package TAWactch.example.TAWatch.auth.controller;

import TAWactch.example.TAWatch.auth.dto.request.OtpSendRequest;
import TAWactch.example.TAWatch.auth.dto.request.OtpVerifyRequest;
import TAWactch.example.TAWatch.auth.dto.response.OtpSendResponse;
import TAWactch.example.TAWatch.auth.dto.response.OtpVerifyResponse;
import TAWactch.example.TAWatch.auth.service.OtpService;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired private OtpService otpService;

    // ------------------------------------------------------------------
    // POST /otp/send
    // Gửi (tạo) mã OTP cho email theo mục đích cụ thể
    // ------------------------------------------------------------------
    @PostMapping("/send")
    public ApiResponse<OtpSendResponse> send(@Valid @RequestBody OtpSendRequest request) {
        ApiResponse<OtpSendResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Gui OTP thanh cong");
        res.setData(otpService.sendOtp(request));
        return res;
    }

    // ------------------------------------------------------------------
    // POST /otp/verify
    // Xác thực mã OTP
    // ------------------------------------------------------------------
    @PostMapping("/verify")
    public ApiResponse<OtpVerifyResponse> verify(@Valid @RequestBody OtpVerifyRequest request) {
        ApiResponse<OtpVerifyResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Xac thuc OTP thanh cong");
        res.setData(otpService.verifyOtp(request));
        return res;
    }
}
