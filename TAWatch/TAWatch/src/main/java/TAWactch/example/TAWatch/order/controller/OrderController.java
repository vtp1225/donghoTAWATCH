package TAWactch.example.TAWatch.order.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.common.enums.OrderStatusType;
import TAWactch.example.TAWatch.order.dto.request.*;
import TAWactch.example.TAWatch.order.dto.response.OrderResponse;
import TAWactch.example.TAWatch.order.service.OrderService;
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
    public ApiResponse<OrderResponse> placeOrder(@Valid @RequestBody OrderRequest request) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
        res.setCode(201);
        res.setMessage("Dat hang thanh cong");
        res.setData(orderService.placeOrder(request));
        return res;
    }

    // ------------------------------------------------------------------
    // GET /orders/{orderId}
    // Xem chi tiết một đơn hàng (user xem đơn của mình, admin/staff xem tất cả)
    // ------------------------------------------------------------------
    @GetMapping("/{orderId}")
    public ApiResponse<OrderResponse> getOrder(
            @PathVariable Integer orderId,
            @RequestAttribute(value = "userId", required = false) Integer currentUserId) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(orderService.getOrderById(orderId, currentUserId));
        return res;
    }

    // ------------------------------------------------------------------
    // GET /orders/my/{userId}
    // Lấy danh sách đơn hàng của user đang đăng nhập
    // ------------------------------------------------------------------
    @GetMapping("/my/{userId}")
    public ApiResponse<List<OrderResponse>> getMyOrders(@PathVariable Integer userId) {
        ApiResponse<List<OrderResponse>> res = new ApiResponse<>();
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
    public ApiResponse<List<OrderResponse>> getAllOrders(
            @RequestParam(required = false) OrderStatusType status) {
        ApiResponse<List<OrderResponse>> res = new ApiResponse<>();
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
    @LogAdminActivity(action = "UPDATE", tableName = "orders")
    public ApiResponse<OrderResponse> cancelOrder(
            @PathVariable Integer orderId,
            @RequestBody OrderCancelRequest request) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
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
    @LogAdminActivity(action = "UPDATE", tableName = "orders")
    public ApiResponse<OrderResponse> updateStatus(
            @PathVariable Integer orderId,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
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
    @LogAdminActivity(action = "UPDATE", tableName = "orders")
    public ApiResponse<OrderResponse> updateTracking(
            @PathVariable Integer orderId,
            @Valid @RequestBody TrackingUpdateRequest request) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
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
    @LogAdminActivity(action = "UPDATE", tableName = "orders")
    public ApiResponse<OrderResponse> assignShipper(
            @PathVariable Integer orderId,
            @Valid @RequestBody ShipperAssignRequest request) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Gan shipper thanh cong");
        res.setData(orderService.assignShipper(orderId, request));
        return res;
    }

    // ------------------------------------------------------------------
    // POST /orders/{orderId}/return
    // Khách hàng yêu cầu đổi/trả
    // ------------------------------------------------------------------
    @PostMapping("/{orderId}/return")
    public ApiResponse<OrderResponse> returnOrder(
            @PathVariable Integer orderId,
            @Valid @RequestBody OrderReturnRequest request) {
        ApiResponse<OrderResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Yeu cau doi tra thanh cong");
        res.setData(orderService.returnOrder(orderId, request.userId(), request.reason()));
        return res;
    }
}
