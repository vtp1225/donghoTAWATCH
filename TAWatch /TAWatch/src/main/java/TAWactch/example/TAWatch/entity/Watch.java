package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.MovementType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "watch", indexes = {
        @Index(name = "idx_watch_brand", columnList = "brand_id"),
        @Index(name = "idx_watch_category", columnList = "category_id"),
        @Index(name = "idx_watch_segment", columnList = "segment_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "sku", columnNames = {"sku"})
})
public class Watch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 50)
    @NotNull
    @Column(name = "sku", nullable = false, length = 50)
    private String sku;

    @Size(max = 255)
    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "segment_id", nullable = false)
    private Segment segment;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private MovementType movementType;

    @Size(max = 100)
    @Column(name = "glass_material", length = 100)
    private String glassMaterial;

    @Column(name = "thickness_mm", precision = 5, scale = 2)
    private BigDecimal thicknessMm;

    @Column(name = "water_resistance_atm", precision = 5, scale = 1)
    private BigDecimal waterResistanceAtm;

    @Column(name = "power_reserve_hours")
    private Integer powerReserveHours;

    @Size(max = 50)
    @Column(name = "battery_type", length = 50)
    private String batteryType;

    @Lob
    @Column(name = "features")
    private String features;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "brand_id", nullable = false)
    private Brand brand;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

}