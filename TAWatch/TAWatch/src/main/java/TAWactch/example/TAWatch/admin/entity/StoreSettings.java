package TAWactch.example.TAWatch.admin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "store_settings")
public class StoreSettings {

    @Id
    @Column(name = "id")
    private Long id = 1L;

    @Column(name = "store_name", length = 200)
    private String storeName;

    @Column(name = "address", length = 500)
    private String address;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "support_email", length = 200)
    private String supportEmail;

    @Column(name = "website", length = 200)
    private String website;

    @Column(name = "default_shipping_fee", precision = 15, scale = 0)
    private BigDecimal defaultShippingFee;

    @Column(name = "free_shipping_threshold", precision = 15, scale = 0)
    private BigDecimal freeShippingThreshold;
}
