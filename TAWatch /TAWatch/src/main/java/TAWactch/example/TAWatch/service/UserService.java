package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.AuthProviderType;
import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.Enum.RoleType;
import TAWactch.example.TAWatch.dto.request.UserRequest;
import TAWactch.example.TAWatch.dto.respone.UserRespone;
import TAWactch.example.TAWatch.entity.Cart;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.UserMappers;
import TAWactch.example.TAWatch.repository.CartRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
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
    public UserRespone createUser(UserRequest userRequest) {
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
    public List<UserRespone> getAllUsers() {
        return userRepo.findAll().stream()
                .map(userMappers::toRespone)
                .toList();
    }

    // ---- Read by id ----
    public UserRespone getUser(int id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMappers.toRespone(user);
    }

    // ---- Update role (ADMIN only) ----
    public UserRespone updateRole(int id, RoleType role) {
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
}
