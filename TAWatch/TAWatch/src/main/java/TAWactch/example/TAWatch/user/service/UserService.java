package TAWactch.example.TAWatch.user.service;

import TAWactch.example.TAWatch.cart.entity.Cart;
import TAWactch.example.TAWatch.cart.repository.CartRepo;
import TAWactch.example.TAWatch.common.enums.AuthProviderType;
import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.enums.LoyaltyTierType;
import TAWactch.example.TAWatch.common.enums.RoleType;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.user.dto.request.UserRequest;
import TAWactch.example.TAWatch.user.dto.response.LoyaltyInfoResponse;
import TAWactch.example.TAWatch.user.dto.response.UserResponse;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.mapper.UserMappers;
import TAWactch.example.TAWatch.user.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private UserMappers userMappers;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private CartRepo cartRepo;

    // ---- Create (admin) ----
    public UserResponse createUser(UserRequest userRequest) {
        if (userRepo.existsByEmail(userRequest.email())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        User user = userMappers.toEntity(userRequest);
        if (userRequest.passwordHash() != null) {
            user.setPasswordHash(passwordEncoder.encode(userRequest.passwordHash()));
        }
        user.setRole(RoleType.CUSTOMER);
        user.setAuthProvider(
                userRequest.authProvider() != null ? userRequest.authProvider() : AuthProviderType.LOCAL);
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

        return userMappers.toRespone(user);
    }

    // ---- Read all ----
    public List<UserResponse> getAllUsers() {
        return userRepo.findAll().stream()
                .map(userMappers::toRespone)
                .toList();
    }

    // ---- Read by id ----
    public UserResponse getUser(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMappers.toRespone(user);
    }


    // ---- Update role (ADMIN only) ----
    public UserResponse updateRole(int id, RoleType role) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setRole(role);
        user.setUpdatedAt(Instant.now());
        return userMappers.toRespone(userRepo.save(user));
    }

    // ---- Delete ----
    public void deleteUser(int id) {
        if (!userRepo.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        userRepo.deleteById(id);
    }
    public UserResponse voHieuHoa(int id)
    {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsActive(false);
        user.setLoyaltyPoints(0);
        userRepo.save(user);
        return userMappers.toRespone(user);
    }
    public UserResponse enableUser(int id)
    {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsActive(true);
        userRepo.save(user);
        return userMappers.toRespone(user);
    }
    // ---- Loyalty info ----
    public LoyaltyInfoResponse getLoyaltyInfo(int userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        int count = user.getLoyaltyPoints();
        LoyaltyTierType tier = LoyaltyTierType.fromOrderCount(count);
        LoyaltyTierType next = tier.next();
        return new LoyaltyInfoResponse(
                tier.name(),
                tier.label,
                count,
                tier.discountPercent,
                next.name(),
                next.label,
                tier.ordersToNext(count)
        );
    }
}
