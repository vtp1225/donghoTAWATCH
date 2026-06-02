package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.dto.request.OrderCancelRequest;
import TAWactch.example.TAWatch.dto.request.OrderRequest;
import TAWactch.example.TAWatch.dto.request.OrderStatusUpdateRequest;
import TAWactch.example.TAWatch.dto.request.ShipperAssignRequest;
import TAWactch.example.TAWatch.dto.request.TrackingUpdateRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.OrderResponse;
import TAWactch.example.TAWatch.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired private OrderService orderService;

    // ------------------------------------------------------------------
    // POST /orders
    // Tạo đơn hàng mới (dành cho user đăng nhập và khách vãng lai)
    // ------------------------------------------------------------------
    @PostMapping
    public ApiRespone<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request) {
        ApiRespone<OrderResponse> res = new ApiRespone<>();
        res.setCode(201);
        res.setMessage("Dat hang thanh cong");
        res.setData(orderService.placeOrder(request));
        return res;
    }

    // ------------------------------------------------------------------
    // GET /orders/{orderId}
    // Xem chi tiết một đơn hàng
    // ------------------------------------------------------------------
    @GetMapping("/{orderId}")
    public ApiRespone<OrderResponse> getOrder(@PathVariable Integer orderId) {
        ApiRespone<OrderResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(orderService.getOrderById(orderId));
        return res;
    }

    // ------------------------------------------------------------------
    // GET /orders/my/{userId}
    // Lấy danh sách đơn hàng của user đang đăng nhập
    // ------------------------------------------------------------------
    @GetMapping("/my/{userId}")
    public ApiRespone<List<OrderResponse>> getMyOrders(@PathVariable Integer userId) {
        ApiRespone<List<OrderResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(orderService.getOrdersByUser(userId));
        return res;
    }

    // ------------------------------------------------------------------
    // GET /orders?status=PENDING
    // Admin: lấy tất cả đơn hàng, có thể lọc theo trạng thái
    // ------------------------------------------------------------------
    @GetMapping
    public ApiRespone<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatusType status) {
        ApiRespone<List<OrderResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(orderService.getAllOrders(status));
        return res;
    }

    // ------------------------------------------------------------------
    // PATCH /orders/{orderId}/cancel
    // Huỷ đơn hàng (chỉ khi trạng thái là PENDING)
    // ------------------------------------------------------------------
    @PatchMapping("/{orderId}/cancel")
    public ApiRespone<OrderResponse> cancelOrder(
            @PathVariable Integer orderId,
            @RequestBody OrderCancelRequest request) {
        ApiRespone<OrderResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Huy don hang thanh cong");
        res.setData(orderService.cancelOrder(orderId, request));
        return res;
    }

    // ------------------------------------------------------------------
    // PATCH /orders/{orderId}/status
    // Admin/Staff: cập nhật trạng thái đơn hàng
    // ------------------------------------------------------------------
    @PatchMapping("/{orderId}/status")
    public ApiRespone<OrderResponse> updateStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        ApiRespone<OrderResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Cap nhat trang thai thanh cong");
        res.setData(orderService.updateOrderStatus(orderId, request));
        return res;
    }

    // ------------------------------------------------------------------
    // PATCH /orders/{orderId}/tracking
    // Admin/Staff: cập nhật mã vận đơn khi đơn đang SHIPPING
    // ------------------------------------------------------------------
    @PatchMapping("/{orderId}/tracking")
    public ApiRespone<OrderResponse> updateTracking(
            @PathVariable Integer orderId,
            @Valid @RequestBody TrackingUpdateRequest request) {
        ApiRespone<OrderResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Cap nhat ma van don thanh cong");
        res.setData(orderService.updateTracking(orderId, request));
        return res;
    }

    // ------------------------------------------------------------------
    // PATCH /orders/{orderId}/assign-shipper
    // Admin/Staff: gán shipper cho đơn hàng
    // ------------------------------------------------------------------
    @PatchMapping("/{orderId}/assign-shipper")
    public ApiRespone<OrderResponse> assignShipper(
            @PathVariable Integer orderId,
            @Valid @RequestBody ShipperAssignRequest request) {
        ApiRespone<OrderResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Gan shipper thanh cong");
        res.setData(orderService.assignShipper(orderId, request));
        return res;
    }
}
