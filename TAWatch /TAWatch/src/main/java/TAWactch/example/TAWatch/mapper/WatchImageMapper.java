package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.WatchImageRequest;
import TAWactch.example.TAWatch.dto.respone.WatchImageResponse;
import TAWactch.example.TAWatch.entity.WatchImage;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface WatchImageMapper {

    @Mapping(target = "watch", ignore = true)
    WatchImage toEntity(WatchImageRequest request);

    @Mapping(source = "watch.id", target = "watchId")
    @Mapping(source = "watch.name", target = "watchName")
    WatchImageResponse toResponse(WatchImage watchImage);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "watch", ignore = true)
    WatchImage partialUpdate(WatchImageRequest request, @MappingTarget WatchImage watchImage);
}
