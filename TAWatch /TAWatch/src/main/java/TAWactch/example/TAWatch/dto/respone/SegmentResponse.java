package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;

import java.io.Serializable;

public record SegmentResponse(
        Integer id,
        String name,
        DeliveryMethodType deliveryMethod
) implements Serializable {}
