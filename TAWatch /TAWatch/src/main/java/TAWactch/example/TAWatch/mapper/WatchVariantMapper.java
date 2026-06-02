package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.WatchVariantRequest;
import TAWactch.example.TAWatch.dto.respone.WatchVariantResponse;
import TAWactch.example.TAWatch.entity.WatchVariant;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface WatchVariantMapper {

    @Mapping(target = "watch", ignore = true)
    WatchVariant toEntity(WatchVariantRequest request);

    @Mapping(source = "watch.id", target = "watchId")
    @Mapping(source = "watch.name", target = "watchName")
    WatchVariantResponse toResponse(WatchVariant watchVariant);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "watch", ignore = true)
    WatchVariant partialUpdate(WatchVariantRequest request, @MappingTarget WatchVariant watchVariant);
}
