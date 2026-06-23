package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.PromotionRequest;
import TAWactch.example.TAWatch.dto.respone.PromotionResponse;
import TAWactch.example.TAWatch.entity.Promotion;
import TAWactch.example.TAWatch.entity.Watch;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.PromotionMapper;
import TAWactch.example.TAWatch.repository.PromotionRepo;
import TAWactch.example.TAWatch.repository.WatchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        if (promotion.getIsActive() == null) promotion.setIsActive(true);
        if (promotion.getMinOrderValue() == null) promotion.setMinOrderValue(java.math.BigDecimal.ZERO);
        if (promotion.getMinPurchaseCount() == null) promotion.setMinPurchaseCount(0);
        resolveWatch(request, promotion);
        return promotionMapper.toResponse(promotionRepo.save(promotion));
    }

    public PromotionResponse update(int id, PromotionRequest request) {
        Promotion promotion = requirePromotion(id);
        promotionMapper.partialUpdate(request, promotion);
        resolveWatch(request, promotion);
        return promotionMapper.toResponse(promotionRepo.save(promotion));
    }

    private void resolveWatch(PromotionRequest request, Promotion promotion) {
        promotion.getWatches().clear();
        if (request.watchIds() != null && !request.watchIds().isEmpty()) {
            java.util.List<Watch> found = watchRepo.findAllById(request.watchIds());
            promotion.getWatches().addAll(found);
            promotion.setAppliesToAll(false);
        } else if (promotion.getPromoType() == TAWactch.example.TAWatch.Enum.PromoType.PRODUCT) {
            promotion.setAppliesToAll(true);
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
