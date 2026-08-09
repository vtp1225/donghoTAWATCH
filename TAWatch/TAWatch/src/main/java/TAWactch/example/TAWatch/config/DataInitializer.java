package TAWactch.example.TAWatch.config;

import TAWactch.example.TAWatch.Enum.AuthProviderType;
import TAWactch.example.TAWatch.Enum.RoleType;
import TAWactch.example.TAWatch.entity.User;
import TAWactch.example.TAWatch.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class DataInitializer implements ApplicationRunner {

    @Autowired
    private UserRepo userRepo;

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
    }
}
