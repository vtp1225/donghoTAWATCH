package TAWactch.example.TAWatch.order.service;

import TAWactch.example.TAWatch.common.enums.OrderStatusType;
import TAWactch.example.TAWatch.order.entity.Order;
import TAWactch.example.TAWatch.order.repository.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GhnAutoUpdateService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private GhnService ghnService;

    // Chạy ngầm định kỳ mỗi 30 phút (30 * 60 * 1000 = 1800000 ms)
    @Scheduled(fixedRate = 1800000)
    public void autoUpdateOrderStatusFromGHN() {
        System.out.println("--- [GHN] Bắt đầu quét tự động cập nhật trạng thái đơn hàng ---");
        
        // Chỉ lấy những đơn hàng đang ở trạng thái Đang giao (SHIPPING)
        List<Order> shippingOrders = orderRepo.findByOrderStatusOrderByCreatedAtDesc(OrderStatusType.SHIPPING);
        
        for (Order order : shippingOrders) {
            String trackingCode = order.getTrackingCode();
            
            if (trackingCode != null && !trackingCode.trim().isEmpty()) {
                try {
                    // Gọi API lấy tracking hiện tại của GHN
                    Map<String, Object> trackingData = ghnService.getOrderTracking(trackingCode);
                    
                    if (trackingData != null) {
                        String ghnStatus = (String) trackingData.get("status");
                        
                        // "delivered" là trạng thái GHN đã giao thành công
                        if ("delivered".equalsIgnoreCase(ghnStatus)) {
                            order.setOrderStatus(OrderStatusType.DELIVERED);
                            orderRepo.save(order);
                            System.out.println("[GHN Auto] Đã tự động cập nhật đơn " + order.getOrderCode() + " thành DELIVERED.");
                        }
                        // Nếu GHN báo khách hủy/hoàn trả hàng ("returned", "return", "cancel")
                        else if ("returned".equalsIgnoreCase(ghnStatus) || "return".equalsIgnoreCase(ghnStatus) || "cancel".equalsIgnoreCase(ghnStatus)) {
                            order.setOrderStatus(OrderStatusType.RETURN_REQUESTED); 
                            orderRepo.save(order);
                            System.out.println("[GHN Auto] Đã tự động cập nhật đơn " + order.getOrderCode() + " thành TRẢ HÀNG/HUỶ.");
                        }
                    }
                } catch (Exception e) {
                    System.err.println("[GHN Auto] Lỗi khi cập nhật đơn: " + order.getOrderCode() + " - " + e.getMessage());
                }
            }
        }
        System.out.println("--- [GHN] Hoàn tất quét ---");
    }
}
