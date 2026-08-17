package TAWactch.example.TAWatch.inventory.dto.response;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record ImportReceiptResponse(
        Integer id,
        String receiptCode,
        String supplierName,
        Integer supplierId,
        String createdByName,
        BigDecimal totalAmount,
        String status,
        String note,
        LocalDate importDate,
        Instant createdAt,
        Instant updatedAt,
        List<ItemResponse> items
) {
    public record ItemResponse(
            Integer id,
            Integer watchVariantId,
            String watchName,
            String variantLabel,
            Integer quantity,
            BigDecimal unitCost,
            BigDecimal totalCost,
            String batchNumber,
            Integer stockQuantity
    ) {}
}
