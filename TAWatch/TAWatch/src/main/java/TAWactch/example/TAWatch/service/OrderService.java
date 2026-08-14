package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.*;
import TAWactch.example.TAWatch.Enum.LoyaltyTierType;
import TAWactch.example.TAWatch.dto.request.OrderCancelRequest;
import TAWactch.example.TAWatch.dto.request.OrderItemRequest;
import TAWactch.example.TAWatch.dto.request.OrderRequest;
import TAWactch.example.TAWatch.dto.request.OrderStatusUpdateRequest;
import TAWactch.example.TAWatch.dto.request.ShipperAssignRequest;
import TAWactch.example.TAWatch.dto.request.TrackingUpdateRequest;
import TAWactch.example.TAWatch.dto.respone.OrderItemResponse;
import TAWactch.example.TAWatch.dto.respone.OrderResponse;
import TAWactch.example.TAWatch.entity.*;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.UserMappers;
import TAWactch.example.TAWatch.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderService {

    @Autowired private OrderRepo orderRepo;
    @Autowired private OrderItemRepo orderItemRepo;
    @Autowired private OrderStatusHistoryRepo historyRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private UserAddressRepo addressRepo;
    @Autowired private WatchVariantRepo watchVariantRepo;
    @Autowired private CouponRepo couponRepo;
    @Autowired private ShipperRepo shipperRepo;
    @Autowired private CouponService couponService;
    @Autowired private WatchVariantImageRepo watchVariantImageRepo;
    @Autowired private UserMappers userMappers;
    @Autowired private PromotionRepo promotionRepo;

    // -------------------------------------------------------
    // Đặt hàng mới
    // -------------------------------------------------------
    @Transactional
    public OrderResponse placeOrder(OrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new AppException(ErrorCode.ORDER_ITEMS_EMPTY);
        }


        // Resolve user
        User user = null;
        if (request.userId() != null) {
            user = userRepo.findById(request.userId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            if(!user.getIsVerified())
                throw new AppException(ErrorCode.EMAIL_NOT_VERIFIED);
        }

        // Resolve address và build snapshot
        String snapshot = buildShippingSnapshot(request, user);

        // Validate từng variant và tính subtotal
        List<WatchVariant> variants = new ArrayList<>();
        for (OrderItemRequest itemReq : request.items()) {
            WatchVariant variant = watchVariantRepo.findById(itemReq.watchVariantId())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
            if (!Boolean.TRUE.equals(variant.getIsActive())) {
                throw new AppException(ErrorCode.WATCH_VARIANT_INACTIVE);
            }
            if (variant.getStockQuantity() < itemReq.quantity()) {
                throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
            }
            variants.add(variant);
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (int i = 0; i < request.items().size(); i++) {
            BigDecimal lineTotal = variants.get(i).getPrice()
                    .multiply(BigDecimal.valueOf(request.items().get(i).quantity()));
            subtotal = subtotal.add(lineTotal);
        }

        // Áp dụng coupon
        BigDecimal discountAmount = BigDecimal.ZERO;
        Coupon coupon = null;
        if (request.couponCode() != null && !request.couponCode().isBlank()) {
            coupon = couponRepo.findByCode(request.couponCode().toUpperCase())
                    .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
                    
            if (user != null && orderRepo.existsByUserIdAndCouponId(user.getId(), coupon.getId())) {
                throw new AppException(ErrorCode.COUPON_ALREADY_USED_BY_USER);
            }

            discountAmount = couponService.validateAndCalculate(coupon, subtotal);
        }



        BigDecimal shippingFee = (request.shippingFee() != null && request.shippingFee().compareTo(BigDecimal.ZERO) > 0)
                ? request.shippingFee()
                : BigDecimal.ZERO;
        BigDecimal totalAmount = subtotal.add(shippingFee).subtract(discountAmount).max(BigDecimal.ZERO);

        // Tạo order
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setUser(user);
        order.setGuestName(request.guestName());
        order.setGuestEmail(request.guestEmail());
        order.setGuestPhone(request.guestPhone());
        if (request.addressId() != null && user != null) {
            UserAddress addr = addressRepo.findByIdAndUserId(request.addressId(), user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
            order.setAddress(addr);
        }
        order.setShippingAddressSnapshot(snapshot);
        order.setSubtotal(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setCoupon(coupon);
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus(PaymentStatusType.UNPAID);
        order.setOrderStatus(OrderStatusType.PENDING);
        order.setDeliveryMethod(request.deliveryMethod());
        order.setNote(request.note());
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());
        order = orderRepo.save(order);

        // Tạo order items + trừ kho
        List<OrderItem> savedItems = new ArrayList<>();
        for (int i = 0; i < request.items().size(); i++) {
            OrderItemRequest itemReq = request.items().get(i);
            WatchVariant variant = variants.get(i);

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setWatchVariant(variant);
            item.setProductSnapshot(buildProductSnapshot(variant));
            item.setQuantity(itemReq.quantity());
            item.setUnitPrice(variant.getPrice());
            item.setUnitCost(variant.getCostPrice() != null ? variant.getCostPrice() : BigDecimal.ZERO);
            item.setTotalPrice(variant.getPrice().multiply(BigDecimal.valueOf(itemReq.quantity())));
            savedItems.add(orderItemRepo.save(item));

            variant.setStockQuantity(variant.getStockQuantity() - itemReq.quantity());
            watchVariantRepo.save(variant);
        }

        // Đánh dấu coupon đã dùng và tăng usedCount trên promotion
        if (coupon != null) {
            couponService.markAsUsed(coupon);
        }

        saveHistory(order, OrderStatusType.PENDING, null, "Don hang moi duoc tao");
        return toOrderResponse(order, savedItems);
    }

    // -------------------------------------------------------
    // Lấy chi tiết đơn hàng
    // -------------------------------------------------------
    public OrderResponse getOrderById(Integer orderId) {
        Order order = requireOrder(orderId);
        List<OrderItem> items = orderItemRepo.findByOrderId(orderId);
        return toOrderResponse(order, items);
    }

    // -------------------------------------------------------
    // Lấy đơn hàng của một user
    // -------------------------------------------------------
    public List<OrderResponse> getOrdersByUser(Integer userId) {
        if (!userRepo.existsById(userId)) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(o -> toOrderResponse(o, orderItemRepo.findByOrderId(o.getId())))
                .toList();
    }

    // -------------------------------------------------------
    // Admin: lấy tất cả đơn hàng (có thể lọc theo status)
    // -------------------------------------------------------
    public List<OrderResponse> getAllOrders(OrderStatusType status) {
        List<Order> orders = (status != null)
                ? orderRepo.findByOrderStatusOrderByCreatedAtDesc(status)
                : orderRepo.findAllByOrderByCreatedAtDesc();
        return orders.stream()
                .map(o -> toOrderResponse(o, orderItemRepo.findByOrderId(o.getId())))
                .toList();
    }

    // -------------------------------------------------------
    // Huỷ đơn hàng (chỉ khi PENDING)
    // -------------------------------------------------------
    @Transactional
    public OrderResponse cancelOrder(Integer orderId, OrderCancelRequest request) {
        Order order = requireOrder(orderId);

        if (request.userId() != null && order.getUser() != null && !order.getUser().getId().equals(request.userId())) {
            throw new AppException(ErrorCode.ORDER_NOT_BELONG_TO_USER);
        }

        if (order.getOrderStatus() != OrderStatusType.PENDING && order.getOrderStatus() != OrderStatusType.CONFIRMED) {
            throw new AppException(ErrorCode.ORDER_CANNOT_CANCEL);
        }
        order.setOrderStatus(OrderStatusType.CANCELLED);
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);

        // Hoàn kho
        for (OrderItem item : orderItemRepo.findByOrderId(orderId)) {
            WatchVariant v = item.getWatchVariant();
            v.setStockQuantity(v.getStockQuantity() + item.getQuantity());
            watchVariantRepo.save(v);
        }

        User changedBy = (request.userId() != null)
                ? userRepo.findById(request.userId()).orElse(null) : null;
        saveHistory(order, OrderStatusType.CANCELLED, changedBy, request.reason());

        List<OrderItem> items = orderItemRepo.findByOrderId(orderId);
        return toOrderResponse(order, items);
    }

    // -------------------------------------------------------
    // Admin: cập nhật trạng thái đơn hàng
    // -------------------------------------------------------
    @Transactional
    public OrderResponse updateOrderStatus(Integer orderId, OrderStatusUpdateRequest request) {
        Order order = requireOrder(orderId);
        OrderStatusType previousStatus = order.getOrderStatus();
        validateStatusTransition(previousStatus, request.newStatus());

        order.setOrderStatus(request.newStatus());
        if (request.newStatus() == OrderStatusType.DELIVERED) {
            order.setPaymentStatus(PaymentStatusType.PAID);
            // Tăng điểm thành viên khi đơn hoàn thành
            if (order.getUser() != null) {
                User customer = order.getUser();
                int oldPoints = customer.getLoyaltyPoints();
                customer.setLoyaltyPoints(oldPoints + 1);

                LoyaltyTierType oldTier = LoyaltyTierType.fromOrderCount(oldPoints);
                LoyaltyTierType newTier = LoyaltyTierType.fromOrderCount(oldPoints + 1);

                if (newTier != oldTier && newTier != LoyaltyTierType.NONE) {
                    grantTierUpgradeCoupons(customer, newTier);
                }
                userRepo.save(customer);
            }
        } else if (request.newStatus() == OrderStatusType.PROCESSING && order.getDeliveryMethod() == DeliveryMethodType.EXTERNAL_SHIPPER) {
            if (order.getTrackingCode() == null || order.getTrackingCode().isEmpty()) {
                createGhnOrder(order);
            }
        } else if (request.newStatus() == OrderStatusType.REFUNDED && previousStatus == OrderStatusType.RETURN_REQUESTED) {
            // Duyệt hoàn tiền cho yêu cầu đổi/trả -> hoàn lại tồn kho
            order.setPaymentStatus(PaymentStatusType.REFUNDED);
            for (OrderItem item : orderItemRepo.findByOrderId(orderId)) {
                WatchVariant v = item.getWatchVariant();
                v.setStockQuantity(v.getStockQuantity() + item.getQuantity());
                watchVariantRepo.save(v);
            }
        }
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);

        User changedBy = (request.changedByUserId() != null)
                ? userRepo.findById(request.changedByUserId()).orElse(null) : null;
        saveHistory(order, request.newStatus(), changedBy, request.note());

        List<OrderItem> items = orderItemRepo.findByOrderId(orderId);
        return toOrderResponse(order, items);
    }

    // -------------------------------------------------------
    // Cập nhật mã vận đơn (ADMIN/STAFF, khi đơn đang SHIPPING)
    // -------------------------------------------------------
    @Transactional
    public OrderResponse updateTracking(Integer orderId, TrackingUpdateRequest request) {
        Order order = requireOrder(orderId);
        if (order.getOrderStatus() != OrderStatusType.SHIPPING) {
            throw new AppException(ErrorCode.ORDER_TRACKING_REQUIRES_SHIPPING);
        }
        order.setTrackingCode(request.trackingCode());
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);
        return toOrderResponse(order, orderItemRepo.findByOrderId(orderId));
    }

    // -------------------------------------------------------
    // Gán shipper cho đơn hàng (ADMIN/STAFF)
    // -------------------------------------------------------
    @Transactional
    public OrderResponse assignShipper(Integer orderId, ShipperAssignRequest request) {
        Order order = requireOrder(orderId);
        if (order.getOrderStatus() != OrderStatusType.CONFIRMED
                && order.getOrderStatus() != OrderStatusType.PROCESSING) {
            throw new AppException(ErrorCode.ORDER_SHIPPER_REQUIRES_CONFIRMED);
        }
        Shipper shipper = shipperRepo.findById(request.shipperId())
                .orElseThrow(() -> new AppException(ErrorCode.SHIPPER_NOT_FOUND));
        order.setShipper(shipper);
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);
        return toOrderResponse(order, orderItemRepo.findByOrderId(orderId));
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    @Autowired
    private GhnService ghnService;
    @Autowired
    private com.fasterxml.jackson.databind.ObjectMapper objectMapper;

    private void createGhnOrder(Order order) {
        try {
            com.fasterxml.jackson.databind.JsonNode snapshot = objectMapper.readTree(order.getShippingAddressSnapshot());
            Integer districtId = snapshot.path("ghnDistrictId").asInt(0);
            String wardCode = snapshot.path("ghnWardCode").asText(null);
            String toName = snapshot.path("recipientName").asText("");
            String toPhone = snapshot.path("phone").asText("");
            String addressDetail = snapshot.path("addressDetail").asText("");

            if (districtId == 0 || wardCode == null || wardCode.isEmpty()) {
                return; // Thiếu thông tin địa chỉ GHN
            }

            List<OrderItem> orderItems = orderItemRepo.findByOrderId(order.getId());
            List<Map<String, Object>> ghnItems = new ArrayList<>();
            int totalWeight = 0;
            
            for (OrderItem item : orderItems) {
                Map<String, Object> ghnItem = new HashMap<>();
                ghnItem.put("name", item.getWatchVariant().getWatch().getName());
                ghnItem.put("quantity", item.getQuantity());
                ghnItem.put("price", item.getUnitPrice().intValue());
                ghnItem.put("weight", 300); // 300g per item
                totalWeight += 300 * item.getQuantity();
                ghnItems.add(ghnItem);
            }

            Integer codAmount = 0;
            if (order.getPaymentMethod() == PaymentMethodType.COD && order.getPaymentStatus() == PaymentStatusType.UNPAID) {
                codAmount = order.getTotalAmount().intValue();
            }

            String trackingCode = ghnService.createShippingOrder(
                    districtId, wardCode, toName, toPhone, addressDetail,
                    totalWeight, order.getTotalAmount().intValue(), codAmount,
                    order.getOrderCode(), ghnItems
            );

            if (trackingCode != null && !trackingCode.isEmpty()) {
                order.setTrackingCode(trackingCode);
            }
        } catch (Exception e) {
            System.err.println("Error triggering GHN order creation: " + e.getMessage());
        }
    }

    private Order requireOrder(Integer orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    // Cấp coupon thăng hạng cho user khi đổi tier
    private void grantTierUpgradeCoupons(User customer, LoyaltyTierType newTier) {
        String promoName = switch (newTier) {
            case BRONZE  -> "Thăng hạng BRONZE";
            case SILVER  -> "Thăng hạng SILVER";
            case GOLD    -> "Thăng hạng GOLD";
            case DIAMOND -> "Thăng hạng DIAMOND";
            default      -> null;
        };
        if (promoName == null) return;

        Promotion promo = promotionRepo.findByName(promoName).orElse(null);
        if (promo == null) return;

        int quantity = switch (newTier) {
            case BRONZE  -> 1;
            case SILVER  -> 2;
            case GOLD    -> 3;
            case DIAMOND -> 4;
            default      -> 0;
        };

        Instant expiresAt = Instant.now().plus(30, java.time.temporal.ChronoUnit.DAYS);
        for (int i = 0; i < quantity; i++) {
            Coupon coupon = new Coupon();
            coupon.setPromotion(promo);
            coupon.setUser(customer);
            coupon.setIsUsed(false);
            coupon.setCode(newTier.name() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            coupon.setExpiresAt(expiresAt);
            couponRepo.save(coupon);
        }
    }

    private void validateStatusTransition(OrderStatusType from, OrderStatusType to) {
        boolean valid = switch (from) {
            case PENDING    -> to == OrderStatusType.CONFIRMED || to == OrderStatusType.CANCELLED;
            case CONFIRMED  -> to == OrderStatusType.PROCESSING || to == OrderStatusType.CANCELLED;
            case PROCESSING -> to == OrderStatusType.SHIPPING;
            case SHIPPING   -> to == OrderStatusType.DELIVERED;
            case DELIVERED  -> to == OrderStatusType.REFUNDED || to == OrderStatusType.RETURN_REQUESTED;
            case RETURN_REQUESTED -> to == OrderStatusType.REFUNDED || to == OrderStatusType.RETURN_REJECTED;
            default -> false;
        };
        if (!valid) throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
    }

    private void saveHistory(Order order, OrderStatusType status, User changedBy, String note) {
        OrderStatusHistory h = new OrderStatusHistory();
        h.setOrder(order);
        h.setStatus(status.name());
        h.setNote(note);
        h.setChangedBy(changedBy);
        h.setChangedAt(Instant.now());
        historyRepo.save(h);
    }

    private String generateOrderCode() {
        String date = DateTimeFormatter.ofPattern("yyyyMMdd")
                .withZone(ZoneId.of("Asia/Ho_Chi_Minh"))
                .format(Instant.now());
        String suffix = String.valueOf(System.currentTimeMillis()).substring(7);
        return "ORD-" + date + "-" + suffix;
    }

    private Map<String, Object> buildProductSnapshot(WatchVariant variant) {
        Watch watch = variant.getWatch();
        Map<String, Object> snap = new LinkedHashMap<>();
        snap.put("watchId",      watch.getId());
        snap.put("watchSlug",    watch.getSlug());
        snap.put("variantId",    variant.getId());
        snap.put("sku",          watch.getSku());
        snap.put("name",         watch.getName());
        snap.put("brand",        watch.getBrand().getName());
        snap.put("dialColor",    variant.getDialColor() != null ? variant.getDialColor().getName() : null);
        snap.put("strapColor",   variant.getStrapColor() != null ? variant.getStrapColor().getName() : null);
        snap.put("strapMaterial",variant.getStrapMaterial() != null ? variant.getStrapMaterial().name() : null);
        snap.put("caseSizeMm",   variant.getCaseSizeMm());
        String imageUrl = variant.getImageUrl();
        if (imageUrl == null || imageUrl.isBlank()) {
            imageUrl = watchVariantImageRepo.findFirstByVariant_Watch_IdAndIsMainImageTrue(watch.getId())
                    .map(WatchVariantImage::getUrl).orElse(null);
        }
        snap.put("imageUrl",     imageUrl);
        snap.put("price",        variant.getPrice());
        return snap;
    }

    private String buildShippingSnapshot(OrderRequest request, User user) {
        if (request.addressId() != null && user != null) {
            UserAddress addr = addressRepo.findByIdAndUserId(request.addressId(), user.getId())
                    .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));
            return String.format(
                    "{\"recipientName\":\"%s\",\"phone\":\"%s\",\"addressDetail\":\"%s\",\"ward\":\"%s\",\"district\":\"%s\",\"province\":\"%s\",\"ghnDistrictId\":%d,\"ghnWardCode\":\"%s\"}",
                    addr.getRecipientName(), addr.getPhone(),
                    addr.getAddressDetail(), addr.getWard(),
                    addr.getDistrict(), addr.getProvince(),
                    addr.getGhnDistrictId() != null ? addr.getGhnDistrictId() : 0,
                    addr.getGhnWardCode() != null ? addr.getGhnWardCode() : ""
            );
        }
        return String.format(
                "{\"recipientName\":\"%s\",\"phone\":\"%s\",\"addressDetail\":\"%s\",\"ghnDistrictId\":%d,\"ghnWardCode\":\"%s\"}",
                nullToEmpty(request.guestName()),
                nullToEmpty(request.guestPhone()),
                nullToEmpty(request.guestAddressDetail()),
                request.ghnDistrictId() != null ? request.ghnDistrictId() : 0,
                request.ghnWardCode() != null ? request.ghnWardCode() : ""
        );
    }

    private String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    private OrderResponse toOrderResponse(Order order, List<OrderItem> items) {
        List<OrderItemResponse> itemResponses = items.stream().map(item -> {
            WatchVariant v = item.getWatchVariant();
            String imageUrl = v.getImageUrl();
            if (imageUrl == null || imageUrl.isBlank()) {
                imageUrl = watchVariantImageRepo.findFirstByVariant_Watch_IdAndIsMainImageTrue(v.getWatch().getId())
                        .map(WatchVariantImage::getUrl).orElse(null);
            }
            return new OrderItemResponse(
                    item.getId(),
                    v.getId(),
                    v.getWatch().getName(),
                    v.getDialColor() != null ? v.getDialColor().getName() : null,
                    v.getStrapColor() != null ? v.getStrapColor().getName() : null,
                    imageUrl,
                    item.getProductSnapshot(),
                    item.getQuantity(),
                    item.getUnitPrice(),
                    item.getTotalPrice()
            );
        }).toList();

        return new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                userMappers.toRespone(order.getUser()),
                order.getGuestName(),
                order.getGuestEmail(),
                order.getGuestPhone(),
                order.getShippingAddressSnapshot(),
                order.getSubtotal(),
                order.getDiscountAmount(),
                order.getShippingFee(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getDeliveryMethod(),
                order.getTrackingCode(),
                order.getNote(),
                order.getReturnReason(),
                itemResponses,
                order.getCreatedAt(),
                order.getUpdatedAt()
        );
    }

    // -------------------------------------------------------
    // Khách hàng yêu cầu đổi/trả
    // -------------------------------------------------------
    @Transactional
    public OrderResponse returnOrder(Integer orderId, Integer userId, String reason) {
        Order order = requireOrder(orderId);
        
        // Kiểm tra đúng user
        if (order.getUser() == null || !order.getUser().getId().equals(userId)) {
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }

        if (order.getOrderStatus() != OrderStatusType.DELIVERED) {
            throw new AppException(ErrorCode.INVALID_STATUS_TRANSITION);
        }

        order.setOrderStatus(OrderStatusType.RETURN_REQUESTED);
        order.setReturnReason(reason);
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);

        User changedBy = userRepo.findById(userId).orElse(null);
        saveHistory(order, OrderStatusType.RETURN_REQUESTED, changedBy, "Yêu cầu đổi/trả: " + reason);

        List<OrderItem> items = orderItemRepo.findByOrderId(orderId);
        return toOrderResponse(order, items);
    }
}
