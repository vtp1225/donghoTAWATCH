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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
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
                .orElseGet(() -> userRepo.findByUsername(request.email())
                        .orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND)));

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

    public AuthResponse loginWithGoogle(String accessToken) {
        GoogleUserInfo info = fetchGoogleUserInfo(accessToken);

        User user = userRepo.findByGoogleId(info.sub())
                .orElseGet(() -> userRepo.findByEmail(info.email()).orElse(null));

        if (user == null) {
            user = new User();
            user.setEmail(info.email());
            user.setFullName(info.name());
            user.setGoogleId(info.sub());
            user.setAuthProvider(AuthProviderType.GOOGLE);
            user.setRole(RoleType.CUSTOMER);
            user.setLoyaltyPoints(0);
            user.setIsActive(true);
            user.setIsVerified(true);
            user.setCreatedAt(Instant.now());
            user.setUpdatedAt(Instant.now());
            userRepo.save(user);

            Cart cart = new Cart();
            cart.setUser(user);
            cart.setCreatedAt(Instant.now());
            cart.setUpdatedAt(Instant.now());
            cartRepo.save(cart);
        } else if (user.getGoogleId() == null) {
            user.setGoogleId(info.sub());
            user.setAuthProvider(AuthProviderType.GOOGLE);
            user.setIsVerified(true);
            user.setUpdatedAt(Instant.now());
            userRepo.save(user);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, "Bearer", userMappers.toRespone(user));
    }

    private GoogleUserInfo fetchGoogleUserInfo(String accessToken) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v3/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new AppException(ErrorCode.GOOGLE_TOKEN_INVALID);
            }
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(response.body());
            String sub = node.path("sub").asText(null);
            String email = node.path("email").asText(null);
            boolean verified = node.path("email_verified").asBoolean(false);
            String name = node.path("name").asText(null);
            if (sub == null || email == null || !verified) {
                throw new AppException(ErrorCode.GOOGLE_TOKEN_INVALID);
            }
            return new GoogleUserInfo(sub, email, name);
        } catch (AppException e) {
            throw e;
        } catch (Exception e) {
            throw new AppException(ErrorCode.GOOGLE_TOKEN_INVALID);
        }
    }

    private record GoogleUserInfo(String sub, String email, String name) {}
}
