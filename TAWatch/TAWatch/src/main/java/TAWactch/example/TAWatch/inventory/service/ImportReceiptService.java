package TAWactch.example.TAWatch.inventory.service;

import TAWactch.example.TAWatch.common.enums.ErrorCode;
import TAWactch.example.TAWatch.common.enums.StatusType;
import TAWactch.example.TAWatch.common.exception.AppException;
import TAWactch.example.TAWatch.inventory.dto.request.ImportReceiptRequest;
import TAWactch.example.TAWatch.inventory.dto.response.ImportReceiptResponse;
import TAWactch.example.TAWatch.inventory.entity.ImportReceipt;
import TAWactch.example.TAWatch.inventory.entity.ImportReceiptItem;
import TAWactch.example.TAWatch.inventory.entity.Supplier;
import TAWactch.example.TAWatch.inventory.repository.ImportReceiptItemRepo;
import TAWactch.example.TAWatch.inventory.repository.ImportReceiptRepo;
import TAWactch.example.TAWatch.inventory.repository.SupplierRepo;
import TAWactch.example.TAWatch.product.entity.WatchVariant;
import TAWactch.example.TAWatch.product.repository.WatchVariantRepo;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.repository.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class ImportReceiptService {

    @Autowired private ImportReceiptRepo receiptRepo;
    @Autowired private ImportReceiptItemRepo itemRepo;
    @Autowired private SupplierRepo supplierRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private WatchVariantRepo variantRepo;

    public List<ImportReceiptResponse> getAll() {
        return receiptRepo.findAllWithDetails().stream()
                .map(r -> toResponse(r, itemRepo.findByReceiptId(r.getId())))
                .toList();
    }

    public ImportReceiptResponse getById(Integer id) {
        ImportReceipt r = receiptRepo.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
        return toResponse(r, itemRepo.findByReceiptId(id));
    }

    @Transactional
    public ImportReceiptResponse create(ImportReceiptRequest req) {
        if (req.items() == null || req.items().isEmpty()) {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_ITEMS_EMPTY);
        }
        Supplier supplier = supplierRepo.findById(req.supplierId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User createdBy = userRepo.findById(req.createdById())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        ImportReceipt receipt = new ImportReceipt();
        receipt.setReceiptCode(generateCode(req.importDate()));
        receipt.setSupplier(supplier);
        receipt.setCreatedBy(createdBy);
        receipt.setImportDate(req.importDate());
        receipt.setNote(req.note());
        receipt.setStatus(StatusType.DRAFT);
        receipt.setTotalAmount(BigDecimal.ZERO);
        receipt.setCreatedAt(Instant.now());
        receipt.setUpdatedAt(Instant.now());
        receipt = receiptRepo.save(receipt);

        BigDecimal total = BigDecimal.ZERO;
        for (ImportReceiptRequest.ItemRequest itemReq : req.items()) {
            WatchVariant variant = variantRepo.findById(itemReq.watchVariantId())
                    .orElseThrow(() -> new AppException(ErrorCode.WATCH_VARIANT_NOT_FOUND));
            BigDecimal lineCost = itemReq.unitCost().multiply(BigDecimal.valueOf(itemReq.quantity()));
            ImportReceiptItem item = new ImportReceiptItem();
            item.setReceipt(receipt);
            item.setWatchVariant(variant);
            item.setQuantity(itemReq.quantity());
            item.setUnitCost(itemReq.unitCost());
            item.setTotalCost(lineCost);
            item.setBatchNumber(itemReq.batchNumber());
            itemRepo.save(item);
            total = total.add(lineCost);
        }

        receipt.setTotalAmount(total);
        receiptRepo.save(receipt);

        return toResponse(receipt, itemRepo.findByReceiptId(receipt.getId()));
    }

    @Transactional
    public ImportReceiptResponse confirm(Integer id) {
        ImportReceipt receipt = receiptRepo.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
        if (receipt.getStatus() == StatusType.CONFIRMED || receipt.getStatus() == StatusType.COMPLETED) {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_ALREADY_CONFIRMED);
        }

        List<ImportReceiptItem> items = itemRepo.findByReceiptId(id);
        for (ImportReceiptItem item : items) {
            WatchVariant variant = item.getWatchVariant();
            
            int oldQty = variant.getStockQuantity() != null ? variant.getStockQuantity() : 0;
            BigDecimal oldCost = variant.getCostPrice() != null ? variant.getCostPrice() : BigDecimal.ZERO;
            
            int newQty = item.getQuantity();
            BigDecimal newCost = item.getUnitCost();
            
            BigDecimal totalOldValue = oldCost.multiply(BigDecimal.valueOf(oldQty));
            BigDecimal totalNewValue = newCost.multiply(BigDecimal.valueOf(newQty));
            
            int totalQty = oldQty + newQty;
            if (totalQty > 0) {
                BigDecimal mac = totalOldValue.add(totalNewValue).divide(BigDecimal.valueOf(totalQty), 2, java.math.RoundingMode.HALF_UP);
                variant.setCostPrice(mac);
            }
            
            variant.setStockQuantity(totalQty);
            variantRepo.save(variant);
        }

        receipt.setStatus(StatusType.CONFIRMED);
        receipt.setUpdatedAt(Instant.now());
        receiptRepo.save(receipt);

        return toResponse(receipt, items);
    }

    @Transactional
    public ImportReceiptResponse cancel(Integer id) {
        ImportReceipt receipt = receiptRepo.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
        if (receipt.getStatus() == StatusType.CONFIRMED || receipt.getStatus() == StatusType.COMPLETED) {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_ALREADY_CONFIRMED);
        }
        receipt.setStatus(StatusType.CANCELLED);
        receipt.setUpdatedAt(Instant.now());
        receiptRepo.save(receipt);
        return toResponse(receipt, itemRepo.findByReceiptId(id));
    }

    @Transactional
    public void delete(Integer id) {
        ImportReceipt receipt = receiptRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMPORT_RECEIPT_NOT_FOUND));
        if (receipt.getStatus() != StatusType.DRAFT && receipt.getStatus() != StatusType.CANCELLED) {
            throw new AppException(ErrorCode.IMPORT_RECEIPT_CANNOT_DELETE);
        }
        itemRepo.deleteByReceiptId(id);
        receiptRepo.deleteById(id);
    }

    private String generateCode(LocalDate date) {
        String datePart = date.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String rand = String.format("%04d", ThreadLocalRandom.current().nextInt(1, 9999));
        String code = "RC-" + datePart + "-" + rand;
        while (receiptRepo.existsByReceiptCode(code)) {
            rand = String.format("%04d", ThreadLocalRandom.current().nextInt(1, 9999));
            code = "RC-" + datePart + "-" + rand;
        }
        return code;
    }

    private ImportReceiptResponse toResponse(ImportReceipt r, List<ImportReceiptItem> items) {
        List<ImportReceiptResponse.ItemResponse> itemResponses = items.stream().map(i -> {
            WatchVariant v = i.getWatchVariant();
            String variantLabel = buildVariantLabel(v);
            return new ImportReceiptResponse.ItemResponse(
                    i.getId(),
                    v.getId(),
                    v.getWatch().getName(),
                    variantLabel,
                    i.getQuantity(),
                    i.getUnitCost(),
                    i.getTotalCost(),
                    i.getBatchNumber(),
                    v.getStockQuantity()
            );
        }).toList();

        return new ImportReceiptResponse(
                r.getId(),
                r.getReceiptCode(),
                r.getSupplier().getName(),
                r.getSupplier().getId(),
                r.getCreatedBy().getFullName(),
                r.getTotalAmount(),
                r.getStatus().name(),
                r.getNote(),
                r.getImportDate(),
                r.getCreatedAt(),
                r.getUpdatedAt(),
                itemResponses
        );
    }

    private String buildVariantLabel(WatchVariant v) {
        StringBuilder sb = new StringBuilder();
        if (v.getDialColor() != null) sb.append("Mặt ").append(v.getDialColor().getName());
        if (v.getStrapColor() != null) {
            if (sb.length() > 0) sb.append(" / ");
            sb.append("Dây ").append(v.getStrapColor().getName());
        }
        if (v.getCaseSizeMm() != null) {
            if (sb.length() > 0) sb.append(" / ");
            sb.append(v.getCaseSizeMm()).append("mm");
        }
        return sb.length() > 0 ? sb.toString() : "Mặc định";
    }
}
