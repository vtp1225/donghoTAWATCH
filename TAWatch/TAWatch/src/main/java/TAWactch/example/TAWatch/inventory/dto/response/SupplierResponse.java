package TAWactch.example.TAWatch.inventory.dto.response;

import java.time.Instant;
import java.util.List;

public record SupplierResponse(
        Integer id,
        String name,
        String email,
        String phone,
        String address,
        Boolean isActive,
        List<BrandInfo> brands,
        Instant createdAt,
        Instant updatedAt
) {
    public record BrandInfo(Integer id, String name) {}
}
