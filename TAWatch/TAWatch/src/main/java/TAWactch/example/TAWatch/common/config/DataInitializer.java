package TAWactch.example.TAWatch.common.config;

import TAWactch.example.TAWatch.common.enums.AuthProviderType;
import TAWactch.example.TAWatch.common.enums.DiscountType;
import TAWactch.example.TAWatch.common.enums.PromoType;
import TAWactch.example.TAWatch.common.enums.RoleType;
import TAWactch.example.TAWatch.promotion.entity.Promotion;
import TAWactch.example.TAWatch.promotion.repository.PromotionRepo;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Component
public class  DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PromotionRepo promotionRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (!userRepo.existsByEmail("admin@gmail.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@gmail.com");
            admin.setPasswordHash(passwordEncoder.encode("123"));
            admin.setFullName("Admin");
            admin.setRole(RoleType.ADMIN);
            admin.setAuthProvider(AuthProviderType.LOCAL);
            admin.setLoyaltyPoints(0);
            admin.setIsActive(true);
            admin.setIsVerified(true);
            admin.setCreatedAt(Instant.now());
            admin.setUpdatedAt(Instant.now());
            userRepo.save(admin);
            System.out.println("Da tao tai khoan admin mac dinh: admin@gmail.com / 123");
        }

        if (!promotionRepo.existsByName("Thăng hạng BRONZE")) {
            Promotion promo = new Promotion();
            promo.setName("Thăng hạng BRONZE");
            promo.setPromoType(PromoType.ORDER);
            promo.setDiscountType(DiscountType.PERCENT);
            promo.setDiscountValue(BigDecimal.valueOf(2.00));
            promo.setMinOrderValue(BigDecimal.ZERO);
            promo.setMaxDiscountAmount(BigDecimal.valueOf(5000000));
            promo.setUsedCount(0);
            promo.setMinPurchaseCount(0);
            promo.setAppliesToAll(true);
            promo.setIsActive(true);
            promo.setStartDate(Instant.now());
            promo.setEndDate(Instant.now().plus(3650, ChronoUnit.DAYS));
            promo.setCreatedAt(Instant.now());
            promotionRepo.save(promo);
            System.out.println("Da tao Promotion 'Thăng hạng BRONZE' mac dinh.");
        }

        if (!promotionRepo.existsByName("Thăng hạng SILVER")) {
            Promotion promo = new Promotion();
            promo.setName("Thăng hạng SILVER");
            promo.setPromoType(PromoType.ORDER);
            promo.setDiscountType(DiscountType.PERCENT);
            promo.setDiscountValue(BigDecimal.valueOf(5.00));
            promo.setMinOrderValue(BigDecimal.ZERO);
            promo.setMaxDiscountAmount(BigDecimal.valueOf(15000000));
            promo.setUsedCount(0);
            promo.setMinPurchaseCount(0);
            promo.setAppliesToAll(true);
            promo.setIsActive(true);
            promo.setStartDate(Instant.now());
            promo.setEndDate(Instant.now().plus(3650, ChronoUnit.DAYS));
            promo.setCreatedAt(Instant.now());
            promotionRepo.save(promo);
            System.out.println("Da tao Promotion 'Thăng hạng SILVER' mac dinh.");
        }

        if (!promotionRepo.existsByName("Thăng hạng GOLD")) {
            Promotion promo = new Promotion();
            promo.setName("Thăng hạng GOLD");
            promo.setPromoType(PromoType.ORDER);
            promo.setDiscountType(DiscountType.PERCENT);
            promo.setDiscountValue(BigDecimal.valueOf(8.00));
            promo.setMinOrderValue(BigDecimal.ZERO);
            promo.setMaxDiscountAmount(BigDecimal.valueOf(30000000));
            promo.setUsedCount(0);
            promo.setMinPurchaseCount(0);
            promo.setAppliesToAll(true);
            promo.setIsActive(true);
            promo.setStartDate(Instant.now());
            promo.setEndDate(Instant.now().plus(3650, ChronoUnit.DAYS));
            promo.setCreatedAt(Instant.now());
            promotionRepo.save(promo);
            System.out.println("Da tao Promotion 'Thăng hạng GOLD' mac dinh.");
        }

        if (!promotionRepo.existsByName("Thăng hạng DIAMOND")) {
            Promotion promo = new Promotion();
            promo.setName("Thăng hạng DIAMOND");
            promo.setPromoType(PromoType.ORDER);
            promo.setDiscountType(DiscountType.PERCENT);
            promo.setDiscountValue(BigDecimal.valueOf(12.00));
            promo.setMinOrderValue(BigDecimal.ZERO);
            promo.setMaxDiscountAmount(BigDecimal.valueOf(50000000));
            promo.setUsedCount(0);
            promo.setMinPurchaseCount(0);
            promo.setAppliesToAll(true);
            promo.setIsActive(true);
            promo.setStartDate(Instant.now());
            promo.setEndDate(Instant.now().plus(3650, ChronoUnit.DAYS));
            promo.setCreatedAt(Instant.now());
            promotionRepo.save(promo);
            System.out.println("Da tao Promotion 'Thăng hạng DIAMOND' mac dinh.");
        }
    }
}
