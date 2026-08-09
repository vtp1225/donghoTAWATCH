package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.RefundMethodType;
import TAWactch.example.TAWatch.Enum.StatusType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigDecimal;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "return_request")
public class ReturnRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Lob
    @Column(name = "reason", nullable = false)
    private String reason;

    @NotNull
    @ColumnDefault("'PENDING'")
    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private StatusType status;

    @Lob
    @Enumerated(EnumType.STRING)
    @Column(name = "refund_method")
    private RefundMethodType refundMethod;

    @Column(name = "refund_amount", precision = 15)
    private BigDecimal refundAmount;

    @Lob
    @Column(name = "admin_note")
    private String adminNote;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}