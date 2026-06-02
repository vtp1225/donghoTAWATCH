package TAWactch.example.TAWatch.dto.respone;

import TAWactch.example.TAWatch.Enum.PurposeType;

import java.time.Instant;

public record OtpSendResponse(
        String email,
        PurposeType purpose,
        Instant expiresAt,
        // Chỉ trả về trong môi trường dev — xoá field này khi tích hợp email thật
        String otpCode
) {}
