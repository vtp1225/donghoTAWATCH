package TAWactch.example.TAWatch.dto.request;

import java.math.BigDecimal;

public record StoreSettingsRequest(
        String storeName,
        String address,
        String phone,
        String supportEmail,
        String website,
        BigDecimal defaultShippingFee,
        BigDecimal freeShippingThreshold
) {}
