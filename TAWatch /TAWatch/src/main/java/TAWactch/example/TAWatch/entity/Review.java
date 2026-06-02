package TAWactch.example.TAWatch.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "review", indexes = {
        @Index(name = "idx_review_watch", columnList = "watch_id")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_review", columnNames = {"user_id", "watch_id", "order_id"})
})
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "watch_id", nullable = false)
    private Watch watch;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull
    @Column(name = "rating", nullable = false)
    private Byte rating;

    @Lob
    @Column(name = "comment")
    private String comment;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}