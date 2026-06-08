package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.respone.CouponResponse;
import TAWactch.example.TAWatch.entity.Coupon;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface CouponMapper {

    @Mapping(source = "promotion.id", target = "promotionId")
    @Mapping(source = "promotion.name", target = "promotionName")
    @Mapping(source = "user.id", target = "userId")
    CouponResponse toResponse(Coupon coupon);
}
