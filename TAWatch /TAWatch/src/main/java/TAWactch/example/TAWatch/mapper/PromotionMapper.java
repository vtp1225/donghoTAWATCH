package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.PromotionRequest;
import TAWactch.example.TAWatch.dto.respone.PromotionResponse;
import TAWactch.example.TAWatch.entity.Promotion;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface PromotionMapper {

    Promotion toEntity(PromotionRequest request);

    PromotionResponse toResponse(Promotion promotion);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    Promotion partialUpdate(PromotionRequest request, @MappingTarget Promotion promotion);
}
