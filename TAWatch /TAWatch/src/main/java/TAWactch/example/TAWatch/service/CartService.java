package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.CartItemRequest;
import TAWactch.example.TAWatch.dto.respone.CartItemResponse;
import TAWactch.example.TAWatch.dto.respone.CartResponse;
import TAWactch.example.TAWatch.entity.Cart;
import TAWactch.example.TAWatch.entity.CartItem;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.entity.WatchVariant;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.repository.CartItemRepo;
import TAWactch.example.TAWatch.repository.CartRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class CartService {

    @Autowired private CartRepo cartRepo;
    @Autowired private CartItemRepo cartItemRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private WatchVariantRepo watchVariantRepo;

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

        cartItemRepo.findByCartIdAndWatchVariantId(cartId, variant.getId())
                .ifPresent(existing -> { throw new AppException(ErrorCode.CART_ITEM_ALREADY_EXISTS); });

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setWatchVariant(variant);
        item.setQuantity(request.quantity());
        item.setUnitPrice(variant.getPrice());
        cartItemRepo.save(item);

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

        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            WatchVariant v = item.getWatchVariant();
            BigDecimal subtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            return new CartItemResponse(
                    item.getId(),
                    cart.getId(),
                    v.getId(),
                    v.getWatch().getName(),
                    v.getDialColor(),
                    v.getStrapColor(),
                    v.getImageUrl(),
                    item.getQuantity(),
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
