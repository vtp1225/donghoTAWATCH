package TAWactch.example.TAWatch.user.dto.response;

import java.io.Serializable;

public record UserAddressResponse(
        Integer id,
        Integer userId,
        String recipientName,
        String phone,
        String addressDetail,
        String province,
        String district,
        String ward,
        Integer ghnDistrictId,
        String ghnWardCode,
        Boolean isDefault
) implements Serializable {}
