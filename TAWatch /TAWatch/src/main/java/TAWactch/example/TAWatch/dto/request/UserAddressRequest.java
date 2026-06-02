package TAWactch.example.TAWatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserAddressRequest(
        @NotBlank @Size(max = 200) String recipientName,
        @NotBlank @Size(max = 20)  String phone,
        @NotBlank                  String addressDetail,
        @NotBlank @Size(max = 100) String province,
        @NotBlank @Size(max = 100) String district,
        @NotBlank @Size(max = 100) String ward,
        Boolean isDefault
) {}
