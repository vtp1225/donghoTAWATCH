package TAWactch.example.TAWatch.auth.controller;

import TAWactch.example.TAWatch.auth.dto.request.GoogleLoginRequest;
import TAWactch.example.TAWatch.auth.dto.request.LoginRequest;
import TAWactch.example.TAWatch.auth.dto.request.RegisterRequest;
import TAWactch.example.TAWatch.auth.dto.request.ResetPasswordRequest;
import TAWactch.example.TAWatch.auth.dto.response.AuthResponse;
import TAWactch.example.TAWatch.auth.service.AuthService;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse<AuthResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Dang ky thanh cong");
        response.setData(authService.register(request));
        return response;
    }


    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Dang nhap thanh cong");
        response.setData(authService.login(request));
        return response;
    }


    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Dat lai mat khau thanh cong");
        return response;
    }


    @PostMapping("/google")
    public ApiResponse<AuthResponse> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest request) {
        ApiResponse<AuthResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Dang nhap Google thanh cong");
        response.setData(authService.loginWithGoogle(request.accessToken()));
        return response;
    }
}
