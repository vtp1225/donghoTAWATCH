package TAWactch.example.TAWatch.wishlist.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

public record WishlistResponse(
        Integer id,
        Integer watchId,
        String watchName,
        String watchSlug,
        String brandName,
        Integer variantId,
        String dialColor,
        String strapColor,
        BigDecimal price,
        String imageUrl,
        Boolean isActive,
        Instant addedAt
) {}
