package TAWactch.example.TAWatch.mapper;

import TAWactch.example.TAWatch.dto.request.UserRequest;
import TAWactch.example.TAWatch.dto.respone.UserRespone;
import TAWactch.example.TAWatch.entity.User;
import org.mapstruct.*;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = MappingConstants.ComponentModel.SPRING)
public interface UserMappers {
    User toEntity(UserRequest userRequest);

    UserRequest toDto(User user);
    UserRespone toRespone(User user);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    User partialUpdate(UserRequest userRequest, @MappingTarget User user);
}