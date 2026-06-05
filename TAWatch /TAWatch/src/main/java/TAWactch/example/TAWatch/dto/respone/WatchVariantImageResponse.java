package TAWactch.example.TAWatch.dto.respone;

import java.io.Serializable;

public record WatchVariantImageResponse(
        Integer id,
        Integer variantId,
        String dialColor,
        String strapColor,
        String url,
        String publicId,
        String altText,
        Boolean isPrimary,
        Boolean isMainImage,
        Integer sortOrder
) implements Serializable {}
