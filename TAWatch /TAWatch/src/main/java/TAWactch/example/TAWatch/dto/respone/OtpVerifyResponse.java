package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.PurposeType;

public record OtpVerifyResponse(
        boolean verified,
        PurposeType purpose,
        // Chỉ có giá trị khi purpose = RESET_PASSWORD; null với các purpose khác
        String resetToken
) {}
