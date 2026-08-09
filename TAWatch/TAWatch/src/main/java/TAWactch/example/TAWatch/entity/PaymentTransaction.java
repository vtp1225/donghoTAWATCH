package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.GatewayType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "payment_transaction", uniqueConstraints = {
        @UniqueConstraint(name = "transaction_code", columnNames = {"transaction_code"})
})
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Size(max = 100)
    @Column(name = "transaction_code", length = 100)
    private String transactionCode;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gateway", nullable = false, length = 50)
    private GatewayType gateway;

    @NotNull
    @Column(name = "amount", nullable = false, precision = 15)
    private BigDecimal amount;

    @NotNull
    @ColumnDefault("'PENDING'")
    @Column(name = "status", nullable = false, length = 50)
    private String status;

    @Column(name = "response_data")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> responseData;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP(6)")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}