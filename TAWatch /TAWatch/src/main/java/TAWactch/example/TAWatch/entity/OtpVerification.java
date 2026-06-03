package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.PurposeType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "otp_verification", indexes = {
        @Index(name = "idx_otp_email", columnList = "email"),
        @Index(name = "idx_otp_expires", columnList = "expires_at")
})
public class OtpVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 150)
    @NotNull
    @Column(name = "email", nullable = false, length = 150)
    private String email;

    @Size(max = 10)
    @NotNull
    @Column(name = "otp_code", nullable = false, length = 10)
    private String otpCode;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "purpose", nullable = false, length = 30)
    private PurposeType purpose;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "is_used", nullable = false)
    private Boolean isUsed = false;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "attempts", nullable = false)
    private Byte attempts;

    @NotNull
    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}