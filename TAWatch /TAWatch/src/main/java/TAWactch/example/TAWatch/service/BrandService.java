package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.dto.request.BrandRequest;
import TAWactch.example.TAWatch.dto.respone.BrandResponse;
import TAWactch.example.TAWatch.entity.Brand;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.mapper.BrandMapper;
import TAWactch.example.TAWatch.repository.BrandRepo;
import TAWactch.example.TAWatch.utils.SlugUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class BrandService {

    @Autowired
    private BrandRepo brandRepo;

    @Autowired
    private BrandMapper brandMapper;

    public List<BrandResponse> getAllBrands() {
        return brandRepo.findAll().stream()
                .map(brandMapper::toResponse)
                .toList();
    }

    public BrandResponse getBrandById(int id) {
        Brand brand = brandRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        return brandMapper.toResponse(brand);
    }

    public BrandResponse getBrandBySlug(String slug) {
        Brand brand = brandRepo.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        return brandMapper.toResponse(brand);
    }

    public BrandResponse createBrand(BrandRequest request) {
        if (brandRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.BRAND_NAME_EXISTS);
        }
        String slug = request.slug() != null && !request.slug().isBlank()
                ? request.slug() : SlugUtils.toSlug(request.name());
        if (brandRepo.existsBySlug(slug)) {
            throw new AppException(ErrorCode.BRAND_SLUG_EXISTS);
        }
        Brand brand = brandMapper.toEntity(request);
        brand.setSlug(slug);
        brand.setIsActive(request.isActive() != null ? request.isActive() : true);
        brand.setCreatedAt(Instant.now());
        brand.setUpdatedAt(Instant.now());
        return brandMapper.toResponse(brandRepo.save(brand));
    }

    public BrandResponse updateBrand(int id, BrandRequest request) {
        Brand brand = brandRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
        if (!brand.getName().equals(request.name()) && brandRepo.existsByName(request.name())) {
            throw new AppException(ErrorCode.BRAND_NAME_EXISTS);
        }
        String slug = request.slug() != null && !request.slug().isBlank()
                ? request.slug() : SlugUtils.toSlug(request.name());
        if (brandRepo.existsBySlugAndIdNot(slug, id)) {
            throw new AppException(ErrorCode.BRAND_SLUG_EXISTS);
        }
        brandMapper.partialUpdate(request, brand);
        brand.setSlug(slug);
        brand.setUpdatedAt(Instant.now());
        return brandMapper.toResponse(brandRepo.save(brand));
    }

    public void deleteBrand(int id) {
        if (!brandRepo.existsById(id)) {
            throw new AppException(ErrorCode.BRAND_NOT_FOUND);
        }
        brandRepo.deleteById(id);
    }
}
