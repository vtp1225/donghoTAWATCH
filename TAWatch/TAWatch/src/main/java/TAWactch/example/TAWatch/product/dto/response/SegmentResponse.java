package TAWactch.example.TAWatch.product.dto.response;

import TAWactch.example.TAWatch.common.enums.DeliveryMethodType;

import java.io.Serializable;

public record SegmentResponse(
        Integer id,
        String name,
        String slug,
        DeliveryMethodType deliveryMethod,
        Long watchCount
) implements Serializable {}
