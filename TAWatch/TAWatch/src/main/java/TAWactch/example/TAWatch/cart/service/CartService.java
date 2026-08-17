package TAWactch.example.TAWatch.cart.service;

import TAWactch.example.TAWatch.cart.dto.request.CartItemRequest;
import TAWactch.example.TAWatch.cart.dto.response.CartItemResponse;
import TAWactch.example.TAWatch.cart.dto.response.CartResponse;
import TAWactch.example.TAWatch.cart.entity.Cart;
import TAWactch.example.TAWatch.cart.entity.CartItem;
import TAWactch.example.TAWatch.cart.repository.CartItemRepo;
import TAWactch.example.TAWatch.cart.repository.CartRepo;
import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.product.entity.WatchVariant;
import TAWactch.example.TAWatch.product.entity.WatchVariantImage;
import TAWactch.example.TAWatch.product.repository.WatchVariantImageRepo;
import TAWactch.example.TAWatch.product.repository.WatchVariantRepo;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired private CartRepo cartRepo;
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private WatchVariantRepo watchVariantRepo;
    @Autowired private WatchVariantImageRepo watchVariantImageRepo;

    // Lấy hoặc tạo mới cart cho user
    @Transactional
    public CartResponse getOrCreateCartForUser(Integer userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Cart cart = cartRepo.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setCreatedAt(Instant.now());
            newCart.setUpdatedAt(Instant.now());
            return cartRepo.save(newCart);
        });

        return buildCartResponse(cart);
    }

    // Lấy hoặc tạo cart theo sessionId (guest)
    @Transactional
    public CartResponse getOrCreateCartBySession(String sessionId) {
        Cart cart = cartRepo.findBySessionId(sessionId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setSessionId(sessionId);
            newCart.setCreatedAt(Instant.now());
            newCart.setUpdatedAt(Instant.now());
            return cartRepo.save(newCart);
        });
        return buildCartResponse(cart);
    }

    // Lấy cart theo cartId
    public CartResponse getCart(Integer cartId) {
        Cart cart = requireCart(cartId);
        return buildCartResponse(cart);
    }

    // Thêm item vào cart
    @Transactional
    public CartResponse addItem(Integer cartId, CartItemRequest request) {
        Cart cart = requireCart(cartId);
        WatchVariant variant = requireActiveVariant(request.watchVariantId());

        if(request.quantity() <= 0) {
            throw new AppException(ErrorCode.INVALID_QUANTITY);
        }

        cartItemRepo.findByCartIdAndWatchVariantId(cartId, variant.getId()).ifPresentOrElse(
                existingItem -> {
                    int newQuantity = existingItem.getQuantity() + request.quantity();
                    if (newQuantity > variant.getStockQuantity()) {
                        throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                    }
                    existingItem.setQuantity(newQuantity);
                    cartItemRepo.save(existingItem);
                },
                () -> {
                    if (request.quantity() > variant.getStockQuantity()) {
                        throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
                    }
                    CartItem item = new CartItem();
                    item.setCart(cart);
                    item.setWatchVariant(variant);
                    item.setQuantity(request.quantity());
                    item.setUnitPrice(variant.getPrice());
                    cartItemRepo.save(item);
                }
        );

        cart.setUpdatedAt(Instant.now());
        cartRepo.save(cart);
        return buildCartResponse(cart);
    }

    // Cập nhật số lượng item
    @Transactional
    public CartResponse updateItem(Integer cartId, Integer itemId, CartItemRequest request) {
        requireCart(cartId);
        CartItem item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!item.getCart().getId().equals(cartId)) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }
        if(request.quantity()>item.getWatchVariant().getStockQuantity())
            throw new AppException(ErrorCode.INSUFFICIENT_STOCK);
        if(request.quantity()<=0)
            throw new AppException(ErrorCode.INVALID_QUANTITY);

        item.setQuantity(request.quantity());
        cartItemRepo.save(item);

        Cart cart = item.getCart();
        cart.setUpdatedAt(Instant.now());
        cartRepo.save(cart);
        return buildCartResponse(cart);
    }

    // Xoá một item
    @Transactional
    public CartResponse removeItem(Integer cartId, Integer itemId) {
        Cart cart = requireCart(cartId);
        CartItem item = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_FOUND));

        if (!item.getCart().getId().equals(cartId)) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        cartItemRepo.delete(item);
        cart.setUpdatedAt(Instant.now());
        cartRepo.save(cart);
        return buildCartResponse(cart);
    }

    // Xoá toàn bộ item trong cart
    @Transactional
    public CartResponse clearCart(Integer cartId) {
        Cart cart = requireCart(cartId);
        cartItemRepo.deleteAllByCartId(cartId);
        cart.setUpdatedAt(Instant.now());
        cartRepo.save(cart);
        return buildCartResponse(cart);
    }

    // Xoá cart
    @Transactional
    public void deleteCart(Integer cartId) {
        if (!cartRepo.existsById(cartId)) {
            throw new AppException(ErrorCode.CART_NOT_FOUND);
        }
        cartRepo.deleteById(cartId);
    }

    // Gộp giỏ hàng từ guest sang user
    @Transactional
    public CartResponse mergeCart(String sessionId, Integer userId) {
        if (sessionId == null || sessionId.isBlank()) {
            return getOrCreateCartForUser(userId);
        }

        Cart guestCart = cartRepo.findBySessionId(sessionId).orElse(null);
        if (guestCart == null) {
            return getOrCreateCartForUser(userId);
        }

        List<CartItem> guestItems = cartItemRepo.findByCartId(guestCart.getId());
        if (guestItems.isEmpty()) {
            cartRepo.delete(guestCart);
            return getOrCreateCartForUser(userId);
        }

        Cart userCart = cartRepo.findByUserId(userId).orElseGet(() -> {
            User user = userRepo.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setCreatedAt(Instant.now());
            newCart.setUpdatedAt(Instant.now());
            return cartRepo.save(newCart);
        });

        for (CartItem guestItem : guestItems) {
            cartItemRepo.findByCartIdAndWatchVariantId(userCart.getId(), guestItem.getWatchVariant().getId())
                .ifPresentOrElse(
                    userItem -> {
                        int newQty = userItem.getQuantity() + guestItem.getQuantity();
                        int maxQty = guestItem.getWatchVariant().getStockQuantity();
                        userItem.setQuantity(Math.min(newQty, maxQty));
                        cartItemRepo.save(userItem);
                    },
                    () -> {
                        CartItem newItem = new CartItem();
                        newItem.setCart(userCart);
                        newItem.setWatchVariant(guestItem.getWatchVariant());
                        int maxQty = guestItem.getWatchVariant().getStockQuantity();
                        newItem.setQuantity(Math.min(guestItem.getQuantity(), maxQty));
                        newItem.setUnitPrice(guestItem.getUnitPrice());
                        cartItemRepo.save(newItem);
                    }
                );
        }

        cartItemRepo.deleteAllByCartId(guestCart.getId());
        cartRepo.delete(guestCart);

        userCart.setUpdatedAt(Instant.now());
        cartRepo.save(userCart);

        return buildCartResponse(userCart);
    }

    // --- helpers ---

    private Cart requireCart(Integer cartId) {
        return cartRepo.findById(cartId)
                .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
    }

    private WatchVariant requireActiveVariant(Integer variantId) {
        WatchVariant variant = watchVariantRepo.findById(variantId)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
        if (!Boolean.TRUE.equals(variant.getIsActive())) {
            throw new AppException(ErrorCode.WATCH_VARIANT_INACTIVE);
        }
        return variant;
    }

    private CartResponse buildCartResponse(Cart cart) {
        List<CartItem> items = cartItemRepo.findByCartId(cart.getId());

        List<Integer> watchIds = items.stream()
                .map(item -> item.getWatchVariant().getWatch().getId())
                .distinct()
                .toList();

        Map<Integer, String> mainImageUrls = watchIds.isEmpty() ? Collections.emptyMap() :
                watchVariantImageRepo.findMainImagesByWatchIds(watchIds)
                        .stream()
                        .collect(Collectors.toMap(
                                img -> img.getVariant().getWatch().getId(),
                                WatchVariantImage::getUrl,
                                (existing, replacement) -> existing
                        ));

        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            WatchVariant v = item.getWatchVariant();
            BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            
            String imageUrl = v.getImageUrl();
            if (imageUrl == null || imageUrl.isBlank()) {
                imageUrl = mainImageUrls.get(v.getWatch().getId());
            }

            return new CartItemResponse(
                    item.getId(),
                    cart.getId(),
                    v.getId(),
                    v.getWatch().getName(),
                    v.getDialColor() != null ? v.getDialColor().getName() : null,
                    v.getStrapColor() != null ? v.getStrapColor().getName() : null,
                    imageUrl,
                    item.getQuantity(),
                    v.getStockQuantity(),
                    item.getUnitPrice(),
                    subtotal
            );
        }).toList();

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(
                cart.getId(),
                cart.getUser() != null ? cart.getUser().getId() : null,
                cart.getSessionId(),
                itemResponses,
                total,
                cart.getCreatedAt(),
                cart.getUpdatedAt()
        );
    }
}
