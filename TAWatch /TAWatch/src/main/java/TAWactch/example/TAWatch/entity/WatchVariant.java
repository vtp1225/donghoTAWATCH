package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.StrapMaterialType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "watch_variant", indexes = {
        @Index(name = "idx_watch_variant", columnList = "watch_id")
})
public class WatchVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "watch_id", nullable = false)
    private Watch watch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dial_color_id")
    private Color dialColor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "strap_color_id")
    private Color strapColor;

    @Enumerated(EnumType.STRING)
    @Column(name = "strap_material", length = 50)
    private StrapMaterialType strapMaterial;

    @Column(name = "case_size_mm", precision = 5, scale = 2)
    private BigDecimal caseSizeMm;

    @NotNull
    @Column(name = "price", nullable = false, precision = 15)
    private BigDecimal price;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

}
