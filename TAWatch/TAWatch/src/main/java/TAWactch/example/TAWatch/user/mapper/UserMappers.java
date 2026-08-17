package TAWactch.example.TAWatch.user.mapper;

import TAWactch.example.TAWatch.user.dto.request.UserRequest;
import TAWactch.example.TAWatch.user.dto.response.UserResponse;
import TAWactch.example.TAWatch.user.entity.User;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMappers {
    User toEntity(UserRequest userRequest);

    UserRequest toDto(User user);
    UserResponse toRespone(User user);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User partialUpdate(UserRequest userRequest, @MappingTarget User user);
}