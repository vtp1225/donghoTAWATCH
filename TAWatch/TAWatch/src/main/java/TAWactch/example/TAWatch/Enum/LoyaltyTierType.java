package TAWactch.example.TAWatch.Enum;

public enum LoyaltyTierType {
    NONE(0, 0, 0.0, "Không có hạng"),
    BRONZE(1, 4, 2.0, "Đồng"),
    SILVER(5, 9, 5.0, "Bạc"),
    GOLD(10, 19, 8.0, "Vàng"),
    DIAMOND(20, Integer.MAX_VALUE, 12.0, "Kim Cương");

    public final int minOrders;
    public final int maxOrders;
    public final double discountPercent;
    public final String label;

    LoyaltyTierType(int minOrders, int maxOrders, double discountPercent, String label) {
        this.minOrders = minOrders;
        this.maxOrders = maxOrders;
        this.discountPercent = discountPercent;
        this.label = label;
    }

    public static LoyaltyTierType fromOrderCount(int count) {
        if (count >= DIAMOND.minOrders) return DIAMOND;
        if (count >= GOLD.minOrders)    return GOLD;
        if (count >= SILVER.minOrders)  return SILVER;
        if (count >= BRONZE.minOrders)  return BRONZE;
        return NONE;
    }

    public LoyaltyTierType next() {
        return switch (this) {
            case NONE   -> BRONZE;
            case BRONZE -> SILVER;
            case SILVER -> GOLD;
            case GOLD   -> DIAMOND;
            case DIAMOND -> DIAMOND;
        };
    }

    public int ordersToNext(int currentCount) {
        LoyaltyTierType nextTier = next();
        if (nextTier == this) return 0;
        return nextTier.minOrders - currentCount;
    }
}
