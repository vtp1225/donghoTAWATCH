package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.CartItemRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.CartResponse;
import TAWactch.example.TAWatch.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired private CartService cartService;

    // GET /cart/{cartId}  — lấy chi tiết cart
    @GetMapping("/{cartId}")
    public ApiRespone<CartResponse> getCart(@PathVariable Integer cartId) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(cartService.getCart(cartId));
        return res;
    }

    // GET /cart/user/{userId}  — lấy hoặc tạo cart cho user đã đăng nhập
    @GetMapping("/user/{userId}")
    public ApiRespone<CartResponse> getOrCreateForUser(@PathVariable Integer userId) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(cartService.getOrCreateCartForUser(userId));
        return res;
    }

    // GET /cart/session/{sessionId}  — lấy hoặc tạo cart cho khách (guest)
    @GetMapping("/session/{sessionId}")
    public ApiRespone<CartResponse> getOrCreateBySession(@PathVariable String sessionId) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(cartService.getOrCreateCartBySession(sessionId));
        return res;
    }

    // POST /cart/{cartId}/items  — thêm sản phẩm vào cart
    @PostMapping("/{cartId}/items")
    public ApiRespone<CartResponse> addItem(
            @PathVariable Integer cartId,
            @Valid @RequestBody CartItemRequest request) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(201);
        res.setMessage("Them san pham vao gio hang thanh cong");
        res.setData(cartService.addItem(cartId, request));
        return res;
    }

    // PUT /cart/{cartId}/items/{itemId}  — cập nhật số lượng
    @PutMapping("/{cartId}/items/{itemId}")
    public ApiRespone<CartResponse> updateItem(
            @PathVariable Integer cartId,
            @PathVariable Integer itemId,
            @Valid @RequestBody CartItemRequest request) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Cap nhat so luong thanh cong");
        res.setData(cartService.updateItem(cartId, itemId, request));
        return res;
    }

    // DELETE /cart/{cartId}/items/{itemId}  — xoá một item
    @DeleteMapping("/{cartId}/items/{itemId}")
    public ApiRespone<CartResponse> removeItem(
            @PathVariable Integer cartId,
            @PathVariable Integer itemId) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xoa san pham khoi gio hang thanh cong");
        res.setData(cartService.removeItem(cartId, itemId));
        return res;
    }

    // DELETE /cart/{cartId}/items  — xoá toàn bộ item (clear cart)
    @DeleteMapping("/{cartId}/items")
    public ApiRespone<CartResponse> clearCart(@PathVariable Integer cartId) {
        ApiRespone<CartResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Lam trong gio hang thanh cong");
        res.setData(cartService.clearCart(cartId));
        return res;
    }

    // DELETE /cart/{cartId}  — xoá cart
    @DeleteMapping("/{cartId}")
    public ApiRespone<Void> deleteCart(@PathVariable Integer cartId) {
        cartService.deleteCart(cartId);
        ApiRespone<Void> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xoa gio hang thanh cong");
        return res;
    }
}
