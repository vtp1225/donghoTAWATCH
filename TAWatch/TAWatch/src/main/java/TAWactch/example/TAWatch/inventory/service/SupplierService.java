package TAWactch.example.TAWatch.inventory.service;

import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.inventory.dto.request.SupplierRequest;
import TAWactch.example.TAWatch.inventory.dto.response.SupplierResponse;
import TAWactch.example.TAWatch.inventory.entity.Supplier;
import TAWactch.example.TAWatch.inventory.entity.SupplierBrand;
import TAWactch.example.TAWatch.inventory.entity.SupplierBrandId;
import TAWactch.example.TAWatch.inventory.repository.SupplierBrandRepo;
import TAWactch.example.TAWatch.inventory.repository.SupplierRepo;
import TAWactch.example.TAWatch.product.entity.Brand;
import TAWactch.example.TAWatch.product.repository.BrandRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class SupplierService {

    @Autowired private SupplierRepo supplierRepo;
    @Autowired private SupplierBrandRepo supplierBrandRepo;
    @Autowired private BrandRepo brandRepo;

    public List<SupplierResponse> getAll() {
        return supplierRepo.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    public SupplierResponse getById(Integer id) {
        return toResponse(require(id));
    }

    @Transactional
    public SupplierResponse create(SupplierRequest req) {
        if (supplierRepo.existsByEmail(req.email())) {
            throw new AppException(ErrorCode.USER_EXISTS);
        }
        Supplier supplier = new Supplier();
        supplier.setName(req.name());
        supplier.setEmail(req.email());
        supplier.setPhone(req.phone());
        supplier.setAddress(req.address());
        supplier.setIsActive(req.isActive() != null ? req.isActive() : true);
        supplier.setCreatedAt(Instant.now());
        supplier.setUpdatedAt(Instant.now());
        supplier = supplierRepo.save(supplier);
        saveBrands(supplier, req.brandIds());
        return toResponse(supplier);
    }

    @Transactional
    public SupplierResponse update(Integer id, SupplierRequest req) {
        Supplier supplier = require(id);
        supplier.setName(req.name());
        supplier.setEmail(req.email());
        supplier.setPhone(req.phone());
        supplier.setAddress(req.address());
        if (req.isActive() != null) supplier.setIsActive(req.isActive());
        supplier.setUpdatedAt(Instant.now());
        supplierRepo.save(supplier);
        supplierBrandRepo.deleteBySupplierId(id);
        saveBrands(supplier, req.brandIds());
        return toResponse(supplier);
    }

    @Transactional
    public void delete(Integer id) {
        if (!supplierRepo.existsById(id)) throw new AppException(ErrorCode.USER_NOT_FOUND);
        supplierBrandRepo.deleteBySupplierId(id);
        supplierRepo.deleteById(id);
    }

    private void saveBrands(Supplier supplier, List<Integer> brandIds) {
        if (brandIds == null || brandIds.isEmpty()) return;
        for (Integer brandId : brandIds) {
            Brand brand = brandRepo.findById(brandId)
                    .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));
            SupplierBrand sb = new SupplierBrand();
            SupplierBrandId sbId = new SupplierBrandId();
            sbId.setSupplierId(supplier.getId());
            sbId.setBrandId(brandId);
            sb.setId(sbId);
            sb.setSupplier(supplier);
            sb.setBrand(brand);
            supplierBrandRepo.save(sb);
        }
    }

    private Supplier require(Integer id) {
        return supplierRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private SupplierResponse toResponse(Supplier supplier) {
        List<SupplierResponse.BrandInfo> brands = supplierBrandRepo.findBySupplierId(supplier.getId())
                .stream()
                .map(sb -> new SupplierResponse.BrandInfo(sb.getBrand().getId(), sb.getBrand().getName()))
                .toList();
        return new SupplierResponse(
                supplier.getId(), supplier.getName(), supplier.getEmail(),
                supplier.getPhone(), supplier.getAddress(), supplier.getIsActive(),
                brands, supplier.getCreatedAt(), supplier.getUpdatedAt()
        );
    }
}
