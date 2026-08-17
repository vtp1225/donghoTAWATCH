package TAWactch.example.TAWatch.admin.service;

import TAWactch.example.TAWatch.admin.dto.request.StoreSettingsRequest;
import TAWactch.example.TAWatch.admin.dto.response.StoreSettingsResponse;
import TAWactch.example.TAWatch.admin.entity.StoreSettings;
import TAWactch.example.TAWatch.admin.repository.StoreSettingsRepo;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class StoreSettingsService {

    @Autowired
    private StoreSettingsRepo repo;

    @PostConstruct
    public void seedDefault() {
        if (repo.count() == 0) {
            StoreSettings s = new StoreSettings();
            s.setId(1L);
            s.setStoreName("TAWatch");
            s.setAddress("123 Nguyễn Huệ, Quận 1, TP.HCM");
            s.setPhone("028 3822 1234");
            s.setSupportEmail("support@tawatch.vn");
            s.setWebsite("tawatch.vn");
            s.setDefaultShippingFee(BigDecimal.valueOf(30000));
            s.setFreeShippingThreshold(BigDecimal.valueOf(2000000));
            repo.save(s);
        }
    }

    public StoreSettingsResponse getSettings() {
        StoreSettings s = repo.findById(1L).orElseGet(() -> {
            StoreSettings def = new StoreSettings();
            def.setId(1L);
            return def;
        });
        return toResponse(s);
    }

    public StoreSettingsResponse updateSettings(StoreSettingsRequest req) {
        StoreSettings s = repo.findById(1L).orElseGet(() -> {
            StoreSettings def = new StoreSettings();
            def.setId(1L);
            return def;
        });
        if (req.storeName() != null)            s.setStoreName(req.storeName());
        if (req.address() != null)              s.setAddress(req.address());
        if (req.phone() != null)                s.setPhone(req.phone());
        if (req.supportEmail() != null)         s.setSupportEmail(req.supportEmail());
        if (req.website() != null)              s.setWebsite(req.website());
        if (req.defaultShippingFee() != null)   s.setDefaultShippingFee(req.defaultShippingFee());
        if (req.freeShippingThreshold() != null) s.setFreeShippingThreshold(req.freeShippingThreshold());
        repo.save(s);
        return toResponse(s);
    }

    private StoreSettingsResponse toResponse(StoreSettings s) {
        return new StoreSettingsResponse(
                s.getStoreName(),
                s.getAddress(),
                s.getPhone(),
                s.getSupportEmail(),
                s.getWebsite(),
                s.getDefaultShippingFee(),
                s.getFreeShippingThreshold()
        );
    }
}
