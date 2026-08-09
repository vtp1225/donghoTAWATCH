package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.OtpSendRequest;
import TAWactch.example.TAWatch.dto.request.OtpVerifyRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.OtpSendResponse;
import TAWactch.example.TAWatch.dto.respone.OtpVerifyResponse;
import TAWactch.example.TAWatch.service.OtpService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/otp")
public class OtpController {

    @Autowired private OtpService otpService;

    // ------------------------------------------------------------------
    // POST /otp/send
    // Gửi (tạo) mã OTP cho email theo mục đích cụ thể
    // ------------------------------------------------------------------
    @PostMapping("/send")
    public ApiRespone<OtpSendResponse> send(@Valid @RequestBody OtpSendRequest request) {
        ApiRespone<OtpSendResponse> res = new ApiRespone<>();
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
    public ApiRespone<OtpVerifyResponse> verify(@Valid @RequestBody OtpVerifyRequest request) {
        ApiRespone<OtpVerifyResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xac thuc OTP thanh cong");
        res.setData(otpService.verifyOtp(request));
        return res;
    }
}
