package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.DiscountType;
import TAWactch.example.TAWatch.Enum.PromoType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "promotion", indexes = {
        @Index(name = "idx_promotion_dates", columnList = "start_date, end_date")
})
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "promo_type", nullable = false)
    private PromoType promoType;

    @NotNull
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @NotNull
    @Column(name = "discount_value", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "min_order_value", nullable = false, precision = 15)
    private BigDecimal minOrderValue;

    @Column(name = "max_discount_amount", precision = 15)
    private BigDecimal maxDiscountAmount;

    @Column(name = "max_uses")
    private Integer maxUses;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "used_count", nullable = false)
    private Integer usedCount;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "min_purchase_count", nullable = false)
    private Integer minPurchaseCount;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "watch_variant_id")
    private WatchVariant watchVariant;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "applies_to_all", nullable = false)
    private Boolean appliesToAll = false;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private Instant startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private Instant endDate;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}