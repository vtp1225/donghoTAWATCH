package TAWactch.example.TAWatch.auth.dto.response;

import TAWactch.example.TAWatch.common.enums.PurposeType;

public record OtpVerifyResponse(
        boolean verified,
        PurposeType purpose,
        // Chỉ có giá trị khi purpose = RESET_PASSWORD; null với các purpose khác
        String resetToken
) {}
