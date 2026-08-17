package TAWactch.example.TAWatch.auth.dto.response;

import TAWactch.example.TAWatch.common.enums.PurposeType;

import java.time.Instant;

public record OtpSendResponse(
        String email,
        PurposeType purpose,
        Instant expiresAt,
        // Chỉ trả về trong môi trường dev — xoá field này khi tích hợp email thật
        String otpCode
) {}
