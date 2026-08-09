package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.Enum.PurposeType;
import TAWactch.example.TAWatch.dto.request.OtpSendRequest;
import TAWactch.example.TAWatch.dto.request.OtpVerifyRequest;
import TAWactch.example.TAWatch.dto.respone.OtpSendResponse;
import TAWactch.example.TAWatch.dto.respone.OtpVerifyResponse;
import TAWactch.example.TAWatch.entity.OtpVerification;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.repository.OtpRepo;
import TAWactch.example.TAWatch.repository.UserRepo;
import TAWactch.example.TAWatch.security.JwtUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class OtpService {

    private static final int OTP_EXPIRY_MINUTES  = 5;
    private static final int COOLDOWN_SECONDS    = 60;
    private static final int MAX_ATTEMPTS        = 5;

    @Autowired private OtpRepo otpRepo;
    @Autowired private UserRepo userRepo;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private EmailService emailService;

    @Value("${app.mail.show-otp-in-response:true}")
    private boolean showOtpInResponse;

    private final SecureRandom random = new SecureRandom();

    // -------------------------------------------------------
    // Gửi OTP
    // -------------------------------------------------------
    @Transactional
    public OtpSendResponse sendOtp(OtpSendRequest request) {
        String email = request.email().toLowerCase().trim();
        PurposeType purpose = request.purpose();

        // Kiểm tra user tồn tại (trừ trường hợp đặc biệt)
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.EMAIl_NOT_FOUND));

        // Với VERIFY_EMAIL: chỉ gửi nếu chưa verified
        if (purpose == PurposeType.VERIFY_EMAIL && Boolean.TRUE.equals(user.getIsVerified())) {
            throw new AppException(ErrorCode.USER_ALREADY_VERIFIED);
        }

        // Cooldown: không gửi lại trong vòng 1 phút
        Instant cooldownSince = Instant.now().minusSeconds(COOLDOWN_SECONDS);
        if (otpRepo.existsRecentOtp(email, purpose, cooldownSince)) {
            throw new AppException(ErrorCode.OTP_SEND_TOO_SOON);
        }

        // Vô hiệu hoá toàn bộ OTP cũ cùng email + purpose
        otpRepo.invalidateAll(email, purpose);

        // Tạo OTP mới
        String code = String.format("%06d", random.nextInt(1_000_000));
        Instant expiresAt = Instant.now().plus(OTP_EXPIRY_MINUTES, ChronoUnit.MINUTES);

        OtpVerification otp = new OtpVerification();
        otp.setEmail(email);
        otp.setOtpCode(code);
        otp.setPurpose(purpose);
        otp.setIsUsed(false);
        otp.setAttempts((byte) 0);
        otp.setExpiresAt(expiresAt);
        otp.setCreatedAt(Instant.now());
        otpRepo.save(otp);

        // Gửi email bất đồng bộ — không block request
        emailService.sendOtpEmail(email, code, purpose);

        // Chỉ trả code trong response khi đang dev/test
        String codeInResponse = showOtpInResponse ? code : null;
        return new OtpSendResponse(email, purpose, expiresAt, codeInResponse);
    }

    // -------------------------------------------------------
    // Xác thực OTP
    // -------------------------------------------------------
    @Transactional
    public OtpVerifyResponse verifyOtp(OtpVerifyRequest request) {
        String email = request.email().toLowerCase().trim();
        PurposeType purpose = request.purpose();

        OtpVerification otp = otpRepo.findActiveOtp(email, purpose, Instant.now())
                .orElseThrow(() -> new AppException(ErrorCode.OTP_NOT_FOUND));

        // Quá số lần thử
        if (otp.getAttempts() >= MAX_ATTEMPTS) {
            otp.setIsUsed(true);
            otpRepo.save(otp);
            throw new AppException(ErrorCode.OTP_MAX_ATTEMPTS);
        }

        // Sai mã
        if (!otp.getOtpCode().equals(request.otpCode())) {
            otp.setAttempts((byte) (otp.getAttempts() + 1));
            if (otp.getAttempts() >= MAX_ATTEMPTS) {
                otp.setIsUsed(true);
            }
            otpRepo.save(otp);
            throw new AppException(ErrorCode.OTP_INVALID);
        }

        // Đúng mã → đánh dấu đã dùng
        otp.setIsUsed(true);
        otpRepo.save(otp);

        // Xử lý theo purpose
        return switch (purpose) {
            case VERIFY_EMAIL    -> handleVerifyEmail(email);
            case RESET_PASSWORD  -> handleResetPassword(email);
            case CHANGE_EMAIL    -> new OtpVerifyResponse(true, purpose, null);
        };
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    private OtpVerifyResponse handleVerifyEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsVerified(true);
        user.setUpdatedAt(Instant.now());
        userRepo.save(user);
        return new OtpVerifyResponse(true, PurposeType.VERIFY_EMAIL, null);
    }

    private OtpVerifyResponse handleResetPassword(String email) {
        userRepo.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        String resetToken = jwtUtil.generateResetToken(email);
        return new OtpVerifyResponse(true, PurposeType.RESET_PASSWORD, resetToken);
    }
}
