package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.PurposeType;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    // required = false → app vẫn khởi động bình thường dù chưa cấu hình SMTP
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:no-reply@tawatch.vn}")
    private String fromAddress;

    @Async
    public void sendOtpEmail(String toEmail, String otpCode, PurposeType purpose) {
        if (mailSender == null) {
            System.err.println("[EmailService] Mail chưa cấu hình. OTP cho " + toEmail + ": " + otpCode);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, "TAWatch");
            helper.setTo(toEmail);
            helper.setSubject(buildSubject(purpose));
            helper.setText(buildHtmlBody(otpCode, purpose), true);

            mailSender.send(message);
        } catch (Exception e) {
            // Log lỗi nhưng không throw ra ngoài (không fail request vì email)
            System.err.println("[EmailService] Failed to send OTP email to " + toEmail + ": " + e.getMessage());
        }
    }

    private String buildSubject(PurposeType purpose) {
        return switch (purpose) {
            case VERIFY_EMAIL   -> "[TAWatch] Mã xác thực email của bạn";
            case RESET_PASSWORD -> "[TAWatch] Mã đặt lại mật khẩu";
            case CHANGE_EMAIL   -> "[TAWatch] Mã xác nhận đổi email";
        };
    }

    private String buildHtmlBody(String otpCode, PurposeType purpose) {
        String action = switch (purpose) {
            case VERIFY_EMAIL   -> "xác thực địa chỉ email";
            case RESET_PASSWORD -> "đặt lại mật khẩu";
            case CHANGE_EMAIL   -> "thay đổi địa chỉ email";
        };

        return """
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
                  <table width="100%%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
                    <tr><td align="center">
                      <table width="560" cellpadding="0" cellspacing="0"
                             style="background:#ffffff;border-radius:8px;overflow:hidden;
                                    box-shadow:0 2px 8px rgba(0,0,0,.08);">

                        <!-- Header -->
                        <tr>
                          <td style="background:#1a1a2e;padding:32px 40px;text-align:center;">
                            <h1 style="margin:0;color:#ffffff;font-size:26px;letter-spacing:2px;">
                              ⌚ TAWatch
                            </h1>
                          </td>
                        </tr>

                        <!-- Body -->
                        <tr>
                          <td style="padding:40px;">
                            <p style="margin:0 0 16px;color:#333;font-size:16px;">Xin chào,</p>
                            <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                              Bạn vừa yêu cầu <strong>%s</strong> trên TAWatch.<br>
                              Vui lòng sử dụng mã OTP dưới đây:
                            </p>

                            <!-- OTP Box -->
                            <table width="100%%" cellpadding="0" cellspacing="0">
                              <tr><td align="center" style="padding:24px 0;">
                                <div style="display:inline-block;background:#f0f0f5;
                                            border:2px dashed #1a1a2e;border-radius:8px;
                                            padding:20px 48px;">
                                  <span style="font-size:40px;font-weight:bold;
                                               letter-spacing:12px;color:#1a1a2e;">
                                    %s
                                  </span>
                                </div>
                              </td></tr>
                            </table>

                            <p style="margin:0 0 8px;color:#888;font-size:13px;text-align:center;">
                              Mã có hiệu lực trong <strong>5 phút</strong>.
                            </p>
                            <p style="margin:0 0 24px;color:#888;font-size:13px;text-align:center;">
                              Nếu bạn không yêu cầu điều này, hãy bỏ qua email này.
                            </p>

                            <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
                            <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
                              © 2026 TAWatch · Không reply email này
                            </p>
                          </td>
                        </tr>

                      </table>
                    </td></tr>
                  </table>
                </body>
                </html>
                """.formatted(action, otpCode);
    }
}
