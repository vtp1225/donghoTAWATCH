package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.UserAddressRequest;
import TAWactch.example.TAWatch.dto.respone.UserAddressResponse;
import TAWactch.example.TAWatch.entity.UserAddress;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserAddressMapper {

    UserAddress toEntity(UserAddressRequest request);

    @Mapping(source = "user.id", target = "userId")
    UserAddressResponse toResponse(UserAddress address);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    UserAddress partialUpdate(UserAddressRequest request, @MappingTarget UserAddress address);
}
