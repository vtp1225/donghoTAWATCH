package TAWactch.example.TAWatch.user.controller;

import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.user.dto.request.UserAddressRequest;
import TAWactch.example.TAWatch.user.dto.response.UserAddressResponse;
import TAWactch.example.TAWatch.user.service.UserAddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/addresses")
public class UserAddressController {

    @Autowired private UserAddressService addressService;

    // GET /users/{userId}/addresses
    @GetMapping
    public ApiResponse<List<UserAddressResponse>> getAll(@PathVariable Integer userId) {
        ApiResponse<List<UserAddressResponse>> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(addressService.getAddressesByUser(userId));
        return res;
    }

    // GET /users/{userId}/addresses/{id}
    @GetMapping("/{id}")
    public ApiResponse<UserAddressResponse> getOne(@PathVariable Integer userId, @PathVariable Integer id) {
        ApiResponse<UserAddressResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(addressService.getAddress(userId, id));
        return res;
    }

    // POST /users/{userId}/addresses
    @PostMapping
    public ApiResponse<UserAddressResponse> create(
            @PathVariable Integer userId,
            @Valid @RequestBody UserAddressRequest request) {
        ApiResponse<UserAddressResponse> res = new ApiResponse<>();
        res.setCode(201);
        res.setMessage("Tao dia chi thanh cong");
        res.setData(addressService.createAddress(userId, request));
        return res;
    }

    // PUT /users/{userId}/addresses/{id}
    @PutMapping("/{id}")
    public ApiResponse<UserAddressResponse> update(
            @PathVariable Integer userId,
            @PathVariable Integer id,
            @Valid @RequestBody UserAddressRequest request) {
        ApiResponse<UserAddressResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Cap nhat dia chi thanh cong");
        res.setData(addressService.updateAddress(userId, id, request));
        return res;
    }

    // PATCH /users/{userId}/addresses/{id}/default
    @PatchMapping("/{id}/default")
    public ApiResponse<UserAddressResponse> setDefault(@PathVariable Integer userId, @PathVariable Integer id) {
        ApiResponse<UserAddressResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Da dat lam dia chi mac dinh");
        res.setData(addressService.setDefault(userId, id));
        return res;
    }

    // DELETE /users/{userId}/addresses/{id}
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Integer userId, @PathVariable Integer id) {
        addressService.deleteAddress(userId, id);
        ApiResponse<Void> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Xoa dia chi thanh cong");
        return res;
    }
}
