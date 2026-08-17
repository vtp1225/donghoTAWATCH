package TAWactch.example.TAWatch.admin.dto.response;

import java.math.BigDecimal;

public record StoreSettingsResponse(
        String storeName,
        String address,
        String phone,
        String supportEmail,
        String website,
        BigDecimal defaultShippingFee,
        BigDecimal freeShippingThreshold
) {}
