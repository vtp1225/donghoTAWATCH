package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.AuthProviderType;
import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.Enum.RoleType;
import TAWactch.example.TAWatch.dto.request.LoginRequest;
import TAWactch.example.TAWatch.dto.request.RegisterRequest;
import TAWactch.example.TAWatch.dto.request.ResetPasswordRequest;
import TAWactch.example.TAWatch.dto.respone.AuthResponse;
import TAWactch.example.TAWatch.entity.Cart;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.UserMappers;
import TAWactch.example.TAWatch.repository.CartRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
import TAWactch.example.TAWatch.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserMappers userMappers;

    @Autowired
    private CartRepo cartRepo;

    public AuthResponse register(RegisterRequest request) {
        if (userRepo.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }

        User user = new User();
        user.setEmail(request.email());
        user.setUsername(request.username());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setBirthday(request.birthday());
        user.setAuthProvider(AuthProviderType.LOCAL);
        user.setRole(RoleType.CUSTOMER);
        user.setLoyaltyPoints(0);
        user.setIsActive(true);
        user.setIsVerified(false);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());

        userRepo.save(user);

        Cart cart = new Cart();
        cart.setUser(user);
        cart.setCreatedAt(Instant.now());
        cart.setUpdatedAt(Instant.now());
        cartRepo.save(cart);

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, "Bearer", userMappers.toRespone(user));
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepo.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.EMAIl_NOT_FOUND));

        if (!user.getIsActive()) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new AppException(ErrorCode.WRONG_PASSWORD);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, "Bearer", userMappers.toRespone(user));
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!jwtUtil.isResetToken(request.resetToken())) {
            throw new AppException(ErrorCode.RESET_TOKEN_INVALID);
        }
        String email = jwtUtil.extractEmail(request.resetToken());
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setUpdatedAt(Instant.now());
        userRepo.save(user);
    }
}
