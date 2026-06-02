package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.UserRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.UserRespone;
import TAWactch.example.TAWatch.service.UserService;
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
    public ApiRespone<List<UserRespone>> getAllUsers() {
        ApiRespone<List<UserRespone>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(userService.getAllUsers());
        return response;
    }

    // GET /tawatch/users/{id}  — lấy user theo id (ADMIN, STAFF)
    @GetMapping("/{id}")
    public ApiRespone<UserRespone> getUserById(@PathVariable int id) {
        ApiRespone<UserRespone> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(userService.getUser(id));
        return response;
    }

    // POST /tawatch/users  — tạo user mới (ADMIN)
    @PostMapping
    public ApiRespone<UserRespone> addUser(@Valid @RequestBody UserRequest userRequest) {
        ApiRespone<UserRespone> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Tao user thanh cong");
        response.setData(userService.createUser(userRequest));
        return response;
    }

    // DELETE /tawatch/users/{id}  — xoá user (ADMIN)
    @DeleteMapping("/{id}")
    public ApiRespone<Void> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        ApiRespone<Void> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Xoa user thanh cong");
        return response;
    }
}
