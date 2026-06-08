package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.DiscountType;
import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.CouponRequest;
import TAWactch.example.TAWatch.dto.request.CouponValidateRequest;
import TAWactch.example.TAWatch.dto.respone.CouponResponse;
import TAWactch.example.TAWatch.dto.respone.CouponValidateResponse;
import TAWactch.example.TAWatch.entity.Coupon;
import TAWactch.example.TAWatch.entity.Promotion;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.CouponMapper;
import TAWactch.example.TAWatch.repository.CouponRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
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
    private UserRepo userRepo;

    public List<CouponResponse> getAll(Integer promotionId, Boolean isUsed) {
        return couponRepo.findAll().stream()
                .filter(c -> promotionId == null || c.getPromotion().getId().equals(promotionId))
                .filter(c -> isUsed == null || c.getIsUsed().equals(isUsed))
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

        Coupon coupon = new Coupon();
        coupon.setPromotion(promotion);
        coupon.setCode(request.code().toUpperCase());
        coupon.setIsUsed(false);
        coupon.setExpiresAt(request.expiresAt());

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
        BigDecimal discount = validateAndCalculate(coupon, request.subtotal());
        return new CouponValidateResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getPromotion().getName(),
                discount,
                request.subtotal().subtract(discount).max(BigDecimal.ZERO)
        );
    }

    public BigDecimal validateAndCalculate(Coupon coupon, BigDecimal subtotal) {
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
        if (subtotal.compareTo(promo.getMinOrderValue()) < 0) {
            throw new AppException(ErrorCode.ORDER_BELOW_MIN_VALUE);
        }

        BigDecimal discount;
        if (promo.getDiscountType() == DiscountType.PERCENTAGE) {
            discount = subtotal.multiply(promo.getDiscountValue()).divide(BigDecimal.valueOf(100));
            if (promo.getMaxDiscountAmount() != null) {
                discount = discount.min(promo.getMaxDiscountAmount());
            }
        } else {
            discount = promo.getDiscountValue();
        }
        return discount.min(subtotal);
    }

    public Coupon requireCoupon(int id) {
        return couponRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COUPON_NOT_FOUND));
    }
}
