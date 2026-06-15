package TAWactch.example.TAWatch.entity;

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
@Table(name = "color", uniqueConstraints = {
        @UniqueConstraint(name = "uk_color_name", columnNames = {"name"})
})
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 80)
    @NotNull
    @Column(name = "name", nullable = false, length = 80)
    private String name;

    // Mã màu hex, ví dụ: #000000
    @Size(max = 10)
    @Column(name = "hex_code", length = 10)
    private String hexCode;

    @NotNull
    @ColumnDefault("1")
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
