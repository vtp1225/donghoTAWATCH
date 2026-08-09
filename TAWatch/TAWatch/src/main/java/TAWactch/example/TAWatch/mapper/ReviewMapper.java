package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.respone.ReviewResponse;
import TAWactch.example.TAWatch.entity.Review;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface ReviewMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "userFullName")
    @Mapping(source = "watch.id", target = "watchId")
    @Mapping(source = "watch.name", target = "watchName")
    @Mapping(source = "order.id", target = "orderId")
    @Mapping(source = "order.orderCode", target = "orderCode")
    @Mapping(source = "rating", target = "rating")
    ReviewResponse toResponse(Review review);
}
