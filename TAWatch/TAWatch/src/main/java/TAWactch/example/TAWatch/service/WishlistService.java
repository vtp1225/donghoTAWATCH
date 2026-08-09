package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.respone.WishlistResponse;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.entity.WatchVariant;
import TAWactch.example.TAWatch.entity.Wishlist;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.repository.UserRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
import TAWactch.example.TAWatch.repository.WishlistRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class WishlistService {

    @Autowired private WishlistRepo wishlistRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private WatchVariantRepo watchVariantRepo;

    public List<WishlistResponse> getWishlist(Integer userId) {
        return wishlistRepo.findByUserIdWithDetails(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public WishlistResponse add(Integer userId, Integer variantId) {
        if (wishlistRepo.existsByUserIdAndWatchVariantId(userId, variantId)) {
            throw new AppException(ErrorCode.WISHLIST_ALREADY_EXISTS);
        }

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        WatchVariant variant = watchVariantRepo.findById(variantId)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setWatchVariant(variant);
        wishlist.setAddedAt(Instant.now());

        return toResponse(wishlistRepo.save(wishlist));
    }

    @Transactional
    public void remove(Integer userId, Integer variantId) {
        if (!wishlistRepo.existsByUserIdAndWatchVariantId(userId, variantId)) {
            throw new AppException(ErrorCode.WISHLIST_NOT_FOUND);
        }
        wishlistRepo.deleteByUserIdAndWatchVariantId(userId, variantId);
    }

    public boolean isInWishlist(Integer userId, Integer variantId) {
        return wishlistRepo.existsByUserIdAndWatchVariantId(userId, variantId);
    }

    public long count(Integer userId) {
        return wishlistRepo.countByUserId(userId);
    }

    private WishlistResponse toResponse(Wishlist w) {
        var variant = w.getWatchVariant();
        var watch = variant.getWatch();
        return new WishlistResponse(
                w.getId(),
                watch.getId(),
                watch.getName(),
                watch.getSlug(),
                watch.getBrand().getName(),
                variant.getId(),
                variant.getDialColor() != null ? variant.getDialColor().getName() : null,
                variant.getStrapColor() != null ? variant.getStrapColor().getName() : null,
                variant.getPrice(),
                variant.getImageUrl(),
                variant.getIsActive(),
                w.getAddedAt()
        );
    }
}
