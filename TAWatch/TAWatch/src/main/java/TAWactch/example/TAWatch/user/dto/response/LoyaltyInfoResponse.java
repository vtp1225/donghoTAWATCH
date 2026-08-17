package TAWactch.example.TAWatch.user.dto.response;

public record LoyaltyInfoResponse(
        String tier,
        String tierLabel,
        int orderCount,
        double discountPercent,
        String nextTier,
        String nextTierLabel,
        int ordersToNextTier
) {}
