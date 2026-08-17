package TAWactch.example.TAWatch.promotion.service;

import TAWactch.example.TAWatch.common.enums.DiscountType;
import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.promotion.dto.request.CouponRequest;
import TAWactch.example.TAWatch.promotion.dto.request.CouponValidateRequest;
import TAWactch.example.TAWatch.promotion.dto.response.CouponResponse;
import TAWactch.example.TAWatch.promotion.dto.response.CouponValidateResponse;
import TAWactch.example.TAWatch.promotion.entity.Coupon;
import TAWactch.example.TAWatch.promotion.entity.Promotion;
import TAWactch.example.TAWatch.promotion.mapper.CouponMapper;
import TAWactch.example.TAWatch.promotion.repository.CouponRepo;
import TAWactch.example.TAWatch.promotion.repository.PromotionRepo;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class CouponService {

    @Autowired
    private CouponRepo couponRepo;

    @Autowired
    private CouponMapper couponMapper;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PromotionRepo promotionRepo;

    @Autowired
    private UserRepo userRepo;

    public List<CouponResponse> getAll(Integer promotionId, Boolean isUsed) {
        return couponRepo.findAll().stream()
                .filter(c -> promotionId == null || c.getPromotion().getId().equals(promotionId))
                .filter(c -> isUsed == null || c.getIsUsed().equals(isUsed))
                .map(couponMapper::toResponse)
                .toList();
    }

    public List<CouponResponse> getFeatured() {
        Instant now = Instant.now();
        return couponRepo.findAll().stream()
                .filter(c -> !Boolean.TRUE.equals(c.getIsUsed()))
                .filter(c -> c.getUser() == null)
                .filter(c -> c.getExpiresAt() == null || c.getExpiresAt().isAfter(now))
                .filter(c -> {
                    Promotion promo = c.getPromotion();
                    return Boolean.TRUE.equals(promo.getIsActive())
                            && !promo.getStartDate().isAfter(now)
                            && !promo.getEndDate().isBefore(now);
                })
                .map(couponMapper::toResponse)
                .toList();
    }

    public CouponResponse getById(int id) {
        return couponMapper.toResponse(requireCoupon(id));
    }

    public CouponResponse create(CouponRequest request) {
        if (couponRepo.findByCode(request.code().toUpperCase()).isPresent()) {
            throw new AppException(ErrorCode.COUPON_CODE_EXISTS);
        }
        Promotion promotion = promotionService.requirePromotion(request.promotionId());

        Instant now = Instant.now();
        if (!Boolean.TRUE.equals(promotion.getIsActive())) {
            throw new AppException(ErrorCode.PROMOTION_INACTIVE);
        }
        if (promotion.getStartDate().isAfter(now)) {
            throw new AppException(ErrorCode.PROMOTION_NOT_STARTED);
        }
        if (promotion.getEndDate().isBefore(now)) {
            throw new AppException(ErrorCode.PROMOTION_EXPIRED);
        }
        if (promotion.getMaxUses() != null && promotion.getUsedCount() >= promotion.getMaxUses()) {
            throw new AppException(ErrorCode.PROMOTION_EXHAUSTED);
        }

        Coupon coupon = new Coupon();
        coupon.setPromotion(promotion);
        coupon.setCode(request.code().toUpperCase());
        coupon.setIsUsed(false);
        coupon.setExpiresAt(promotion.getEndDate());
        if (request.userId() != null) {
            User user = userRepo.findById(request.userId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            coupon.setUser(user);
        }

        return couponMapper.toResponse(couponRepo.save(coupon));
    }

    public void delete(int id) {
        if (!couponRepo.existsById(id)) throw new AppException(ErrorCode.COUPON_NOT_FOUND);
        couponRepo.deleteById(id);
    }

    public CouponValidateResponse validate(CouponValidateRequest request) {
        Coupon coupon = couponRepo.findByCode(request.code().toUpperCase())
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
        BigDecimal discount = validateAndCalculate(coupon, request.subtotal(), request.watchIds());
        return new CouponValidateResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getPromotion().getName(),
                discount,
                request.subtotal().subtract(discount).max(BigDecimal.ZERO)
        );
    }

    public BigDecimal validateAndCalculate(Coupon coupon, BigDecimal subtotal, java.util.List<Integer> cartWatchIds) {
        if (Boolean.TRUE.equals(coupon.getIsUsed())) {
            throw new AppException(ErrorCode.COUPON_ALREADY_USED);
        }
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(Instant.now())) {
            throw new AppException(ErrorCode.COUPON_EXPIRED);
        }
        Promotion promo = coupon.getPromotion();
        if (!Boolean.TRUE.equals(promo.getIsActive())) {
            throw new AppException(ErrorCode.COUPON_INACTIVE);
        }
        if (promo.getMaxUses() != null && promo.getUsedCount() >= promo.getMaxUses()) {
            throw new AppException(ErrorCode.COUPON_INACTIVE);
        }
        if (subtotal.compareTo(promo.getMinOrderValue()) < 0) {
            throw new AppException(ErrorCode.ORDER_BELOW_MIN_VALUE);
        }

        if (!Boolean.TRUE.equals(promo.getAppliesToAll())) {
            if (cartWatchIds == null || cartWatchIds.isEmpty()) {
                throw new AppException(ErrorCode.COUPON_NOT_APPLICABLE_FOR_THESE_ITEMS);
            }
            java.util.Set<Integer> allowedWatchIds = promo.getWatches().stream()
                    .map(TAWactch.example.TAWatch.product.entity.Watch::getId)
                    .collect(java.util.stream.Collectors.toSet());
                    
            boolean isValid = cartWatchIds.stream().anyMatch(allowedWatchIds::contains);
            if (!isValid) {
                throw new AppException(ErrorCode.COUPON_NOT_APPLICABLE_FOR_THESE_ITEMS);
            }
        }

        BigDecimal discount;
        if (promo.getDiscountType() == DiscountType.PERCENT) {
            discount = subtotal.multiply(promo.getDiscountValue()).divide(BigDecimal.valueOf(100));
            if (promo.getMaxDiscountAmount() != null) {
                discount = discount.min(promo.getMaxDiscountAmount());
            }
        } else {
            discount = promo.getDiscountValue();
        }
        return discount.min(subtotal);
    }

    public void markAsUsed(Coupon coupon) {
        if (coupon.getUser() != null) {
            coupon.setIsUsed(true);
            coupon.setUsedAt(Instant.now());
            couponRepo.save(coupon);
        }

        Promotion promo = coupon.getPromotion();
        promo.setUsedCount(promo.getUsedCount() + 1);
        promotionRepo.save(promo);
    }

    public Coupon requireCoupon(int id) {
        return couponRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
    }

    public List<CouponResponse> getMyCoupons(Integer userId) {
        Instant now = Instant.now();
        return couponRepo.findByUserIdAndIsUsedFalse(userId).stream()
                .filter(c -> c.getExpiresAt() == null || c.getExpiresAt().isAfter(now))
                .filter(c -> {
                    Promotion promo = c.getPromotion();
                    return Boolean.TRUE.equals(promo.getIsActive())
                            && !promo.getStartDate().isAfter(now)
                            && !promo.getEndDate().isBefore(now);
                })
                .map(couponMapper::toResponse)
                .toList();
    }
}
