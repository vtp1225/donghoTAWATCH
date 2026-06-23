package TAWactch.example.TAWatch.dto.respone;

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
