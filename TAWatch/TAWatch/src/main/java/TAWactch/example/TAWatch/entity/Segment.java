package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "segment", uniqueConstraints = {
        @UniqueConstraint(name = "uk_segment_slug", columnNames = {"slug"})
})
public class Segment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Size(max = 120)
    @Column(name = "slug", length = 120)
    private String slug;

    @NotNull
    @ColumnDefault("'EXTERNAL_SHIPPER'")
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_method", nullable = false)
    private DeliveryMethodType deliveryMethod;

}