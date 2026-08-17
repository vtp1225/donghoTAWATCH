package TAWactch.example.TAWatch.inventory.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ImportReceiptRequest(
        @NotNull Integer supplierId,
        @NotNull Integer createdById,
        @NotNull LocalDate importDate,
        String note,
        @NotNull @Size(min = 1) List<ItemRequest> items
) {
    public record ItemRequest(
            @NotNull Integer watchVariantId,
            @NotNull @PositiveOrZero(message = "So luong phai lon hon 0") Integer quantity,
            @NotNull @PositiveOrZero(message ="Don gia phai lon hon 0") BigDecimal unitCost,
            String batchNumber
    ) {}
}
