package TAWactch.example.TAWatch.user.controller;

import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.user.dto.request.RoleUpdateRequest;
import TAWactch.example.TAWatch.user.dto.request.UserRequest;
import TAWactch.example.TAWatch.user.dto.response.LoyaltyInfoResponse;
import TAWactch.example.TAWatch.user.dto.response.UserResponse;
import TAWactch.example.TAWatch.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // GET /tawatch/users  — lấy tất cả user (ADMIN, STAFF)
    @GetMapping
    public ApiResponse<List<UserResponse>> getAllUsers() {
        ApiResponse<List<UserResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(userService.getAllUsers());
        return response;
    }

    // GET /tawatch/users/{id}  — lấy user theo id (ADMIN, STAFF)
    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getUserById(@PathVariable int id) {
        ApiResponse<UserResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(userService.getUser(id));
        return response;
    }

    // POST /tawatch/users  — tạo user mới (ADMIN)
    @PostMapping
    public ApiResponse<UserResponse> addUser(@Valid @RequestBody UserRequest userRequest) {
        ApiResponse<UserResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Tao user thanh cong");
        response.setData(userService.createUser(userRequest));
        return response;
    }

    // PATCH /tawatch/users/{id}/role  — đổi vai trò (ADMIN)
    @PatchMapping("/{id}/role")
    public ApiResponse<UserResponse> updateRole(@PathVariable int id, @Valid @RequestBody RoleUpdateRequest request) {
        ApiResponse<UserResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Cap nhat quyen thanh cong");
        response.setData(userService.updateRole(id, request.role()));
        return response;
    }

    // DELETE /tawatch/users/{id}  — xoá user (ADMIN)
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        ApiResponse<Void> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Xoa user thanh cong");
        return response;
    }

    // GET /tawatch/users/{id}/loyalty  — lấy thông tin hạng thành viên
    @GetMapping("/{id}/loyalty")
    public ApiResponse<LoyaltyInfoResponse> getLoyaltyInfo(@PathVariable int id) {
        ApiResponse<LoyaltyInfoResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(userService.getLoyaltyInfo(id));
        return response;
    }
    @PutMapping("/{id}/disable")
    public ApiResponse<UserResponse> disableUser(@PathVariable int id) {
        ApiResponse<UserResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Vo hieu hoa thanh cong");
        response.setData(userService.voHieuHoa(id));
        return response;
    }
    @PutMapping("/{id}/enable")
    public ApiResponse<UserResponse> enableUser(@PathVariable int id) {
        ApiResponse<UserResponse> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Khoi dong lai thanh cong");
        response.setData(userService.enableUser(id));
        return response;
    }
}
