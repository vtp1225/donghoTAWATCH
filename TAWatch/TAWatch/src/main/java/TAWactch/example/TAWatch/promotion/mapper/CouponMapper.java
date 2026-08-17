package TAWactch.example.TAWatch.promotion.mapper;

import TAWactch.example.TAWatch.promotion.dto.response.CouponResponse;
import TAWactch.example.TAWatch.promotion.entity.Coupon;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface CouponMapper {

    @Mapping(source = "promotion.id", target = "promotionId")
    @Mapping(source = "promotion.name", target = "promotionName")
    @Mapping(source = "user.id", target = "userId")
    CouponResponse toResponse(Coupon coupon);
}
