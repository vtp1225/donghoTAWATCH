package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.WishlistResponse;
import TAWactch.example.TAWatch.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // GET /wishlist/user/{userId}
    @GetMapping("/user/{userId}")
    public ApiRespone<List<WishlistResponse>> getWishlist(@PathVariable Integer userId) {
        ApiRespone<List<WishlistResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(wishlistService.getWishlist(userId));
        return res;
    }

    // POST /wishlist/user/{userId}/variants/{variantId}
    @PostMapping("/user/{userId}/variants/{variantId}")
    public ApiRespone<WishlistResponse> add(
            @PathVariable Integer userId,
            @PathVariable Integer variantId) {
        ApiRespone<WishlistResponse> res = new ApiRespone<>();
        res.setCode(201);
        res.setMessage("Da them vao danh sach yeu thich");
        res.setData(wishlistService.add(userId, variantId));
        return res;
    }

    // DELETE /wishlist/user/{userId}/variants/{variantId}
    @DeleteMapping("/user/{userId}/variants/{variantId}")
    public ApiRespone<Void> remove(
            @PathVariable Integer userId,
            @PathVariable Integer variantId) {
        wishlistService.remove(userId, variantId);
        ApiRespone<Void> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Da xoa khoi danh sach yeu thich");
        return res;
    }

    // GET /wishlist/user/{userId}/check/{variantId}
    @GetMapping("/user/{userId}/check/{variantId}")
    public ApiRespone<Map<String, Boolean>> check(
            @PathVariable Integer userId,
            @PathVariable Integer variantId) {
        ApiRespone<Map<String, Boolean>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(Map.of("inWishlist", wishlistService.isInWishlist(userId, variantId)));
        return res;
    }
}
