package TAWactch.example.TAWatch.wishlist.controller;

import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.wishlist.dto.response.WishlistResponse;
import TAWactch.example.TAWatch.wishlist.service.WishlistService;
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
    public ApiResponse<List<WishlistResponse>> getWishlist(@PathVariable Integer userId) {
        ApiResponse<List<WishlistResponse>> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(wishlistService.getWishlist(userId));
        return res;
    }

    // POST /wishlist/user/{userId}/variants/{variantId}
    @PostMapping("/user/{userId}/variants/{variantId}")
    public ApiResponse<WishlistResponse> add(
            @PathVariable Integer userId,
            @PathVariable Integer variantId) {
        ApiResponse<WishlistResponse> res = new ApiResponse<>();
        res.setCode(201);
        res.setMessage("Da them vao danh sach yeu thich");
        res.setData(wishlistService.add(userId, variantId));
        return res;
    }

    // DELETE /wishlist/user/{userId}/variants/{variantId}
    @DeleteMapping("/user/{userId}/variants/{variantId}")
    public ApiResponse<Void> remove(
            @PathVariable Integer userId,
            @PathVariable Integer variantId) {
        wishlistService.remove(userId, variantId);
        ApiResponse<Void> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Da xoa khoi danh sach yeu thich");
        return res;
    }

    // GET /wishlist/user/{userId}/check/{variantId}
    @GetMapping("/user/{userId}/check/{variantId}")
    public ApiResponse<Map<String, Boolean>> check(
            @PathVariable Integer userId,
            @PathVariable Integer variantId) {
        ApiResponse<Map<String, Boolean>> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(Map.of("inWishlist", wishlistService.isInWishlist(userId, variantId)));
        return res;
    }
}
