package TAWactch.example.TAWatch.promotion.service;

import TAWactch.example.TAWatch.common.enums.DiscountType;
import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.enums.PromoType;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.product.entity.Watch;
import TAWactch.example.TAWatch.product.entity.WatchVariant;
import TAWactch.example.TAWatch.product.repository.WatchRepo;
import TAWactch.example.TAWatch.product.repository.WatchVariantRepo;
import TAWactch.example.TAWatch.promotion.dto.request.PromotionRequest;
import TAWactch.example.TAWatch.promotion.dto.response.PromotionResponse;
import TAWactch.example.TAWatch.promotion.entity.Promotion;
import TAWactch.example.TAWatch.promotion.mapper.PromotionMapper;
import TAWactch.example.TAWatch.promotion.repository.PromotionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepo promotionRepo;

    @Autowired
    private PromotionMapper promotionMapper;

    @Autowired
    private WatchRepo watchRepo;

    @Autowired
    private WatchVariantRepo watchVariantRepo;

    public List<PromotionResponse> getAll(Boolean isActive) {
        List<Promotion> list = (isActive != null)
                ? promotionRepo.findByIsActive(isActive)
                : promotionRepo.findAll();
        return list.stream().map(promotionMapper::toResponse).toList();
    }

    public PromotionResponse getById(int id) {
        return promotionMapper.toResponse(requirePromotion(id));
    }

    public PromotionResponse create(PromotionRequest request) {
        Promotion promotion = promotionMapper.toEntity(request);
        promotion.setUsedCount(0);
        promotion.setCreatedAt(Instant.now());
        if(request.startDate() != null&&request.endDate() != null) {
            if(request.endDate().isBefore(request.startDate())) {
                throw new AppException(ErrorCode.INVALID_DATE_RANGE);
            }
        }
        if(request.startDate().isAfter(request.endDate())) {
            throw new AppException(ErrorCode.INVALID_DATE_RANGE);
        }
        if (promotion.getIsActive() == null) promotion.setIsActive(true);
        if (promotion.getMinOrderValue() == null) promotion.setMinOrderValue(java.math.BigDecimal.ZERO);
        if (promotion.getMinPurchaseCount() == null) promotion.setMinPurchaseCount(0);
        if (promotion.getMaxUses() == null) throw new AppException(ErrorCode.PROMOTION_MAX_USES_REQUIRED);
        resolveWatch(request, promotion);
        validateProfitMargin(promotion);
        return promotionMapper.toResponse(promotionRepo.save(promotion));
    }

    public PromotionResponse update(int id, PromotionRequest request) {
        Promotion promotion = requirePromotion(id);
        if(request.startDate() != null&&request.endDate() != null) {
            if(request.endDate().isBefore(request.startDate())) {
                throw new AppException(ErrorCode.INVALID_DATE_RANGE);
            }
        }
        promotionMapper.partialUpdate(request, promotion);
        if (promotion.getMaxUses() == null) throw new AppException(ErrorCode.PROMOTION_MAX_USES_REQUIRED);
        resolveWatch(request, promotion);
        validateProfitMargin(promotion);
        return promotionMapper.toResponse(promotionRepo.save(promotion));

    }

    private void resolveWatch(PromotionRequest request, Promotion promotion) {
        promotion.getWatches().clear();
        if (request.watchIds() != null && !request.watchIds().isEmpty()) {
            java.util.List<Watch> found = watchRepo.findAllById(request.watchIds());
            promotion.getWatches().addAll(found);
            promotion.setAppliesToAll(false);
        } else if (promotion.getPromoType() == PromoType.PRODUCT) {
            promotion.setAppliesToAll(true);
        }
    }

    private void validateProfitMargin(Promotion promotion) {
        if (promotion.getPromoType() !=PromoType.PRODUCT) return;
        
        List<WatchVariant> variantsToCheck;
        if (Boolean.TRUE.equals(promotion.getAppliesToAll())) {
            variantsToCheck = watchVariantRepo.findAll();
        } else if (!promotion.getWatches().isEmpty()) {
            List<Integer> watchIds = promotion.getWatches().stream().map(Watch::getId).toList();
            variantsToCheck = watchVariantRepo.findAllByWatchIds(watchIds);
        } else {
            return;
        }

        for (WatchVariant v : variantsToCheck) {
            if (v.getPrice() == null || v.getCostPrice() == null) continue;
            
            BigDecimal discountAmount = BigDecimal.ZERO;
            if (promotion.getDiscountType() == DiscountType.FIXED_AMOUNT) {
                discountAmount = promotion.getDiscountValue();
            } else if (promotion.getDiscountType() == DiscountType.PERCENT) {
                discountAmount = v.getPrice().multiply(promotion.getDiscountValue()).divide(BigDecimal.valueOf(100));
                if (promotion.getMaxDiscountAmount() != null && discountAmount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                    discountAmount = promotion.getMaxDiscountAmount();
                }
            }
            
            BigDecimal finalPrice = v.getPrice().subtract(discountAmount);
            if (finalPrice.compareTo(v.getCostPrice()) < 0) {
                throw new AppException(ErrorCode.PROMOTION_CAUSES_LOSS);
            }
        }
    }

    public void delete(int id) {
        if (!promotionRepo.existsById(id)) throw new AppException(ErrorCode.PROMOTION_NOT_FOUND);
        promotionRepo.deleteById(id);
    }

    public Promotion requirePromotion(int id) {
        return promotionRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));
    }

}
