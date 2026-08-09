package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.UserAddressRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.UserAddressResponse;
import TAWactch.example.TAWatch.service.UserAddressService;
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
    public ApiRespone<List<UserAddressResponse>> getAll(@PathVariable Integer userId) {
        ApiRespone<List<UserAddressResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(addressService.getAddressesByUser(userId));
        return res;
    }

    // GET /users/{userId}/addresses/{id}
    @GetMapping("/{id}")
    public ApiRespone<UserAddressResponse> getOne(@PathVariable Integer userId, @PathVariable Integer id) {
        ApiRespone<UserAddressResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(addressService.getAddress(userId, id));
        return res;
    }

    // POST /users/{userId}/addresses
    @PostMapping
    public ApiRespone<UserAddressResponse> create(
            @PathVariable Integer userId,
            @Valid @RequestBody UserAddressRequest request) {
        ApiRespone<UserAddressResponse> res = new ApiRespone<>();
        res.setCode(201);
        res.setMessage("Tao dia chi thanh cong");
        res.setData(addressService.createAddress(userId, request));
        return res;
    }

    // PUT /users/{userId}/addresses/{id}
    @PutMapping("/{id}")
    public ApiRespone<UserAddressResponse> update(
            @PathVariable Integer userId,
            @PathVariable Integer id,
            @Valid @RequestBody UserAddressRequest request) {
        ApiRespone<UserAddressResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Cap nhat dia chi thanh cong");
        res.setData(addressService.updateAddress(userId, id, request));
        return res;
    }

    // PATCH /users/{userId}/addresses/{id}/default
    @PatchMapping("/{id}/default")
    public ApiRespone<UserAddressResponse> setDefault(@PathVariable Integer userId, @PathVariable Integer id) {
        ApiRespone<UserAddressResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Da dat lam dia chi mac dinh");
        res.setData(addressService.setDefault(userId, id));
        return res;
    }

    // DELETE /users/{userId}/addresses/{id}
    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable Integer userId, @PathVariable Integer id) {
        addressService.deleteAddress(userId, id);
        ApiRespone<Void> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xoa dia chi thanh cong");
        return res;
    }
}
