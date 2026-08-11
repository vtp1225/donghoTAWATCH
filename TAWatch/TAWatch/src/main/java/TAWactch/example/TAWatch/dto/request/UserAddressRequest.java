package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserAddressRequest(
        @NotBlank @Size(max = 200) String recipientName,
        @NotBlank @Pattern(regexp = "^(0|84)(3|5|7|8|9)[0-9]{8}$", message = "Số điện thoại không hợp lệ") String phone,
        @NotBlank                  String addressDetail,
        @NotBlank @Size(max = 100) String province,
        @NotBlank @Size(max = 100) String district,
        @NotBlank @Size(max = 100) String ward,
        Integer ghnDistrictId,
        String ghnWardCode,
        Boolean isDefault
) {}
