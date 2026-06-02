package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.LoginRequest;
import TAWactch.example.TAWatch.dto.request.RegisterRequest;
import TAWactch.example.TAWatch.dto.request.ResetPasswordRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.AuthResponse;
import TAWactch.example.TAWatch.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ApiRespone<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        ApiRespone<AuthResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Dang ky thanh cong");
        response.setData(authService.register(request));
        return response;
    }

    @PostMapping("/login")
    public ApiRespone<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        ApiRespone<AuthResponse> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Dang nhap thanh cong");
        response.setData(authService.login(request));
        return response;
    }

    // POST /auth/reset-password — Đặt lại mật khẩu (dùng resetToken từ OTP verify)
    @PostMapping("/reset-password")
    public ApiRespone<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Dat lai mat khau thanh cong");
        return response;
    }
}
