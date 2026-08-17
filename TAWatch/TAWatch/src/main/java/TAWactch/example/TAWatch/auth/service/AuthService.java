package TAWactch.example.TAWatch.auth.service;

import TAWactch.example.TAWatch.auth.dto.request.LoginRequest;
import TAWactch.example.TAWatch.auth.dto.request.RegisterRequest;
import TAWactch.example.TAWatch.auth.dto.request.ResetPasswordRequest;
import TAWactch.example.TAWatch.auth.dto.response.AuthResponse;
import TAWactch.example.TAWatch.cart.entity.Cart;
import TAWactch.example.TAWatch.cart.repository.CartRepo;
import TAWactch.example.TAWatch.common.enums.AuthProviderType;
import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.enums.RoleType;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.common.security.JwtUtil;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.mapper.UserMappers;
import TAWactch.example.TAWatch.user.repository.UserRepo;
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

    /**
     * Xử lý logic đăng nhập người dùng.
     * 1. Tìm user theo Email, nếu không có thử tìm theo Username.
     * 2. Kiểm tra xem tài khoản có đang bị khóa (IsActive) hay không.
     * 3. So khớp mật khẩu nhập vào với mã băm trong DB.
     * 4. Khởi tạo và trả về JWT token.
     *
     * @param request Dữ liệu đăng nhập
     * @return Thông tin đăng nhập bao gồm JWT token
     */
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

    /**
     * Xử lý logic đặt lại mật khẩu mới.
     * 1. Xác thực resetToken (được sinh ra trong luồng OTP) xem có hợp lệ và còn hạn không.
     * 2. Trích xuất email từ token, tìm User tương ứng.
     * 3. Cập nhật mật khẩu mới (đã mã hóa) vào DB.
     *
     * @param request Chứa resetToken và mật khẩu mới
     */
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

    /**
     * Xử lý logic đăng nhập bằng Google.
     * 1. Lấy thông tin user (email, name...) từ Google thông qua accessToken.
     * 2. Tìm user trong DB bằng GoogleId hoặc Email.
     * 3. Nếu chưa tồn tại: Tạo User mới (Provider: Google) kèm theo Giỏ hàng.
     * 4. Nếu tồn tại nhưng chưa liên kết Google: Cập nhật GoogleId cho User.
     * 5. Khởi tạo và trả về JWT token.
     *
     * @param accessToken Token do Google trả về bên phía client
     * @return Thông tin đăng nhập bao gồm JWT token
     */
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

    /**
     * Hàm phụ trợ gọi API của Google để xác thực và lấy thông tin User từ accessToken.
     * Gửi request lên "https://www.googleapis.com/oauth2/v3/userinfo" để parse lấy sub (ID), email, name...
     *
     * @param accessToken Token do Google trả về bên phía client
     * @return Đối tượng chứa thông tin cơ bản của User lấy từ Google
     */
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
