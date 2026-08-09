package TAWactch.example.TAWatch.dto.respone;

public record LoyaltyInfoResponse(
        String tier,
        String tierLabel,
        int orderCount,
        double discountPercent,
        String nextTier,
        String nextTierLabel,
        int ordersToNextTier
) {}
