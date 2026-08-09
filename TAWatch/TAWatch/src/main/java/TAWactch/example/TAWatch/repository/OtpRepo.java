package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.Enum.PurposeType;
import TAWactch.example.TAWatch.entity.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface OtpRepo extends JpaRepository<OtpVerification, Integer> {

    // Tìm OTP đang còn hiệu lực (chưa dùng, chưa hết hạn) mới nhất
    @Query("SELECT o FROM OtpVerification o WHERE o.email = :email AND o.purpose = :purpose " +
           "AND o.isUsed = false AND o.expiresAt > :now ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpVerification> findActiveOtp(String email, PurposeType purpose, Instant now);

    // Kiểm tra cooldown: có OTP nào được gửi trong 1 phút gần đây không
    @Query("SELECT COUNT(o) > 0 FROM OtpVerification o WHERE o.email = :email " +
           "AND o.purpose = :purpose AND o.createdAt > :since")
    boolean existsRecentOtp(String email, PurposeType purpose, Instant since);

    // Vô hiệu hoá tất cả OTP cũ của email+purpose trước khi gửi mới
    @Modifying
    @Query("UPDATE OtpVerification o SET o.isUsed = true WHERE o.email = :email " +
           "AND o.purpose = :purpose AND o.isUsed = false")
    void invalidateAll(String email, PurposeType purpose);
}
