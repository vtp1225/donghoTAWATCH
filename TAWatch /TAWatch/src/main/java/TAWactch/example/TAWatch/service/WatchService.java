package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.DiscountType;
import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.WatchFilterRequest;
import TAWactch.example.TAWatch.dto.request.WatchRequest;
import TAWactch.example.TAWatch.dto.respone.PagedResponse;
import TAWactch.example.TAWatch.dto.respone.WatchResponse;
import TAWactch.example.TAWatch.entity.Promotion;
import TAWactch.example.TAWatch.entity.Watch;
import TAWactch.example.TAWatch.entity.WatchVariant;
import TAWactch.example.TAWatch.entity.WatchVariantImage;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.WatchMapper;
import TAWactch.example.TAWatch.repository.BrandRepo;
import TAWactch.example.TAWatch.repository.CategoryRepo;
import TAWactch.example.TAWatch.repository.PromotionRepo;
import TAWactch.example.TAWatch.repository.SegmentRepo;
import TAWactch.example.TAWatch.repository.WatchRepo;
import TAWactch.example.TAWatch.repository.WatchVariantImageRepo;
import TAWactch.example.TAWatch.repository.WatchVariantRepo;
import TAWactch.example.TAWatch.utils.SlugUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class WatchService {

    @Autowired
    private WatchRepo watchRepo;
    @Autowired
    private BrandRepo brandRepo;
    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    private SegmentRepo segmentRepo;
    @Autowired
    private WatchMapper watchMapper;
    @Autowired
    private WatchVariantRepo watchVariantRepo;
    @Autowired
    private WatchVariantImageRepo watchVariantImageRepo;
    @Autowired
    private PromotionRepo promotionRepo;

    public List<WatchResponse> getAllWatches() {
        return enrichWatches(watchRepo.findByIsActiveTrue(), true);
    }

    public List<WatchResponse> getWatchesByIds(List<Integer> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        return enrichWatches(watchRepo.findByIdInAndIsActiveTrue(ids), true);
    }

    public PagedResponse<WatchResponse> getWatchesPaged(int page, int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Watch> watchPage = watchRepo.findByIsActiveTrue(pageable);
        List<WatchResponse> content = enrichWatches(watchPage.getContent(), true);
        return new PagedResponse<>(content, page, watchPage.getTotalPages(), watchPage.getTotalElements(), size);
    }

    public List<WatchResponse> getAllWatchesAdmin() {
        return enrichWatches(watchRepo.findAll(), false);
    }

    public WatchResponse getWatchById(int id) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        return watchMapper.toResponse(watch);
    }

    public WatchResponse getWatchBySlug(String slug) {
        Watch watch = watchRepo.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        return watchMapper.toResponse(watch);
    }

    public WatchResponse createWatch(WatchRequest request) {
        if (watchRepo.existsBySku(request.sku())) {
            throw new AppException(ErrorCode.WATCH_SKU_EXISTS);
        }
        String slug = resolveWatchSlug(request.slug(), request.name(), request.sku(), null);
        Watch watch = watchMapper.toEntity(request);
        watch.setSlug(slug);
        watch.setBrand(brandRepo.findById(request.brandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND)));
        watch.setCategory(categoryRepo.findById(request.categoryId())
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
        watch.setSegment(segmentRepo.findById(request.segmentId())
                .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND)));
        watch.setIsActive(request.isActive() != null ? request.isActive() : true);
        watch.setCreatedAt(Instant.now());
        watch.setUpdatedAt(Instant.now());
        return watchMapper.toResponse(watchRepo.save(watch));
    }

    public WatchResponse updateWatch(int id, WatchRequest request) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        if (!watch.getSku().equals(request.sku()) && watchRepo.existsBySku(request.sku())) {
            throw new AppException(ErrorCode.WATCH_SKU_EXISTS);
        }
        String slug = resolveWatchSlugForUpdate(request.slug(), request.name(), request.sku(), id);
        watchMapper.partialUpdate(request, watch);
        watch.setSlug(slug);
        if (request.brandId() != null) {
            watch.setBrand(brandRepo.findById(request.brandId())
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND)));
        }
        if (request.categoryId() != null) {
            watch.setCategory(categoryRepo.findById(request.categoryId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND)));
        }
        if (request.segmentId() != null) {
            watch.setSegment(segmentRepo.findById(request.segmentId())
                    .orElseThrow(() -> new AppException(ErrorCode.SEGMENT_NOT_FOUND)));
        }
        watch.setUpdatedAt(Instant.now());
        return watchMapper.toResponse(watchRepo.save(watch));
    }

    private String resolveWatchSlug(String requestSlug, String name, String sku, Integer excludeId) {
        if (requestSlug != null && !requestSlug.isBlank()) {
            if (excludeId != null ? watchRepo.existsBySlugAndIdNot(requestSlug, excludeId)
                                  : watchRepo.existsBySlug(requestSlug)) {
                throw new AppException(ErrorCode.WATCH_SLUG_EXISTS);
            }
            return requestSlug;
        }
        String slug = SlugUtils.toSlug(name);
        boolean conflict = excludeId != null ? watchRepo.existsBySlugAndIdNot(slug, excludeId)
                                             : watchRepo.existsBySlug(slug);
        if (conflict) {
            slug = slug + "-" + SlugUtils.toSlug(sku);
            boolean stillConflict = excludeId != null ? watchRepo.existsBySlugAndIdNot(slug, excludeId)
                                                      : watchRepo.existsBySlug(slug);
            if (stillConflict) {
                throw new AppException(ErrorCode.WATCH_SLUG_EXISTS);
            }
        }
        return slug;
    }

    private String resolveWatchSlugForUpdate(String requestSlug, String name, String sku, int id) {
        return resolveWatchSlug(requestSlug, name, sku, id);
    }

    public WatchResponse updateWatchStatus(int id, Boolean isActive) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        if (isActive != null) {
            watch.setIsActive(isActive);
        }
        watch.setUpdatedAt(Instant.now());
        return watchMapper.toResponse(watchRepo.save(watch));
    }

    public PagedResponse<WatchResponse> getWatchesAdminPaged(int page, int size, String search, Integer brandId, Integer categoryId, Integer segmentId, Boolean isActive) {
        String searchParam = (search != null && !search.isBlank()) ? search.trim() : null;
        PageRequest pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Watch> watchPage = watchRepo.searchAdmin(searchParam, brandId, categoryId, segmentId, isActive, pageable);
        List<WatchResponse> content = enrichWatches(watchPage.getContent(), false);
        return new PagedResponse<>(content, page, watchPage.getTotalPages(), watchPage.getTotalElements(), size);
    }

    public List<WatchResponse> getFeaturedWatches() {
        return enrichWatches(watchRepo.findByIsFeaturedTrueAndIsActiveTrue(), true);
    }

    public List<WatchResponse> getNewestWatches(int limit) {
        return enrichWatches(watchRepo.findByIsActiveTrueOrderByCreatedAtDesc(PageRequest.of(0, limit)), true);
    }

    public List<WatchResponse> getWatchesByCategory(int categoryId, int limit) {
        return enrichWatches(watchRepo.findByCategoryIdActive(categoryId, PageRequest.of(0, limit)), true);
    }

    public PagedResponse<WatchResponse> searchPublic(WatchFilterRequest req) {
        int page = req.page() != null ? req.page() : 0;
        int size = req.size() != null ? req.size() : 12;

        List<Integer> brandIds = req.brandIds() != null ? req.brandIds() : List.of();
        List<Integer> categoryIds = req.categoryIds() != null ? req.categoryIds() : List.of();
        List<Integer> segmentIds = req.segmentIds() != null ? req.segmentIds() : List.of();
        List<String> movementTypes = req.movementTypes() != null ? req.movementTypes() : List.of();

        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equals(req.sort())) sort = Sort.by(Sort.Direction.ASC, "createdAt"); // fallback, price sorted client-side
        if ("price_desc".equals(req.sort())) sort = Sort.by(Sort.Direction.DESC, "createdAt");

        PageRequest pageable = PageRequest.of(page, size, sort);
        String nameParam = (req.name() != null && !req.name().isBlank()) ? req.name().trim() : null;
        Page<Watch> watchPage = watchRepo.searchPublic(
                nameParam,
                brandIds, !brandIds.isEmpty(),
                categoryIds, !categoryIds.isEmpty(),
                segmentIds, !segmentIds.isEmpty(),
                movementTypes, !movementTypes.isEmpty(),
                req.minPrice(), req.maxPrice(),
                pageable
        );
        List<WatchResponse> content = enrichWatches(watchPage.getContent(), true);
        return new PagedResponse<>(content, page, watchPage.getTotalPages(), watchPage.getTotalElements(), size);
    }

    public WatchResponse toggleFeatured(int id, boolean isFeatured) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        watch.setIsFeatured(isFeatured);
        watch.setUpdatedAt(Instant.now());
        return watchMapper.toResponse(watchRepo.save(watch));
    }

    private List<WatchResponse> enrichWatches(List<Watch> watches, boolean activeVariantsOnly) {
        if (watches.isEmpty()) return List.of();
        List<Integer> watchIds = watches.stream().map(Watch::getId).toList();

        Map<Integer, List<WatchVariant>> variantsByWatch = (activeVariantsOnly
                ? watchVariantRepo.findActiveByWatchIds(watchIds)
                : watchVariantRepo.findAllByWatchIds(watchIds))
                .stream()
                .collect(Collectors.groupingBy(v -> v.getWatch().getId()));

        Map<Integer, String> mainImageUrls = watchVariantImageRepo
                .findMainImagesByWatchIds(watchIds)
                .stream()
                .collect(Collectors.toMap(
                        img -> img.getVariant().getWatch().getId(),
                        WatchVariantImage::getUrl,
                        (existing, replacement) -> existing
                ));

        // Batch-fetch active promotions and build a map: watchId → best promotion
        List<Promotion> activePromos = promotionRepo.findActiveForWatches(watchIds, Instant.now());
        Map<Integer, Promotion> promoByWatch = new HashMap<>();
        // appliesToAll first (lower priority)
        activePromos.stream()
                .filter(p -> Boolean.TRUE.equals(p.getAppliesToAll()))
                .findFirst()
                .ifPresent(p -> watchIds.forEach(wid -> promoByWatch.put(wid, p)));
        // watch-specific overrides appliesToAll
        activePromos.stream()
                .filter(p -> p.getWatches() != null && !p.getWatches().isEmpty())
                .forEach(p -> p.getWatches().forEach(w -> promoByWatch.put(w.getId(), p)));

        return watches.stream().map(watch -> {
            WatchResponse base = watchMapper.toResponse(watch);
            List<WatchVariant> variants = variantsByWatch.getOrDefault(watch.getId(), List.of());

            BigDecimal minPrice = variants.stream()
                    .map(WatchVariant::getPrice)
                    .filter(Objects::nonNull)
                    .min(Comparator.naturalOrder())
                    .orElse(null);

            Integer defaultVariantId = variants.stream()
                    .filter(v -> v.getStockQuantity() != null && v.getStockQuantity() > 0)
                    .min(Comparator.comparing(v -> v.getPrice() != null ? v.getPrice() : BigDecimal.ZERO))
                    .map(WatchVariant::getId)
                    .orElse(variants.stream().findFirst().map(WatchVariant::getId).orElse(null));

            int totalStock = variants.stream()
                    .mapToInt(v -> v.getStockQuantity() != null ? v.getStockQuantity() : 0)
                    .sum();

            // Compute sale price
            BigDecimal salePrice = null;
            Integer discountPercent = null;
            Promotion promo = promoByWatch.get(watch.getId());
            if (promo != null && minPrice != null && minPrice.compareTo(BigDecimal.ZERO) > 0) {
                if (promo.getDiscountType() == DiscountType.PERCENT) {
                    discountPercent = promo.getDiscountValue().intValue();
                    BigDecimal discount = minPrice.multiply(promo.getDiscountValue())
                            .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                    if (promo.getMaxDiscountAmount() != null && discount.compareTo(promo.getMaxDiscountAmount()) > 0) {
                        discount = promo.getMaxDiscountAmount();
                    }
                    salePrice = minPrice.subtract(discount).max(BigDecimal.ZERO);
                } else {
                    salePrice = minPrice.subtract(promo.getDiscountValue()).max(BigDecimal.ZERO);
                    BigDecimal saved = minPrice.subtract(salePrice);
                    discountPercent = saved.multiply(BigDecimal.valueOf(100))
                            .divide(minPrice, 0, RoundingMode.HALF_UP).intValue();
                }
            }

            return new WatchResponse(
                    base.id(), base.sku(), base.name(), base.slug(),
                    base.segmentId(), base.segmentName(), base.description(),
                    base.movementType(), base.glassMaterial(), base.thicknessMm(),
                    base.waterResistanceAtm(), base.powerReserveHours(), base.batteryType(),
                    base.features(), base.isActive(), base.isFeatured(), base.createdAt(), base.updatedAt(),
                    base.brandId(), base.brandName(), base.categoryId(), base.categoryName(),
                    minPrice, mainImageUrls.get(watch.getId()), defaultVariantId, totalStock,
                    salePrice, discountPercent
            );
        }).toList();
    }

    public void deleteWatch(int id) {
        Watch watch = watchRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.WATCH_NOT_FOUND));
        watch.setIsActive(false);
        watch.setUpdatedAt(Instant.now());
        watchRepo.save(watch);
    }
}
