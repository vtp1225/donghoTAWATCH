package TAWactch.example.TAWatch.entity;

import TAWactch.example.TAWatch.Enum.DeliveryMethodType;
import TAWactch.example.TAWatch.Enum.OrderStatusType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import TAWactch.example.TAWatch.Enum.PaymentStatusType;
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
@Table(name = "`order`", indexes = {
        @Index(name = "idx_order_user", columnList = "user_id"),
        @Index(name = "idx_order_status", columnList = "order_status"),
        @Index(name = "idx_order_created", columnList = "created_at")
}, uniqueConstraints = {
        @UniqueConstraint(name = "order_code", columnNames = {"order_code"})
})
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 30)
    @NotNull
    @Column(name = "order_code", nullable = false, length = 30)
    private String orderCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "user_id")
    private User user;

    @Size(max = 150)
    @Column(name = "guest_email", length = 150)
    private String guestEmail;

    @Size(max = 20)
    @Column(name = "guest_phone", length = 20)
    private String guestPhone;

    @Size(max = 200)
    @Column(name = "guest_name", length = 200)
    private String guestName;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "address_id")
    private UserAddress address;

    @NotNull
    @Lob
    @Column(name = "shipping_address_snapshot", nullable = false)
    private String shippingAddressSnapshot;

    @NotNull
    @Column(name = "subtotal", nullable = false, precision = 15)
    private BigDecimal subtotal;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "discount_amount", nullable = false, precision = 15)
    private BigDecimal discountAmount;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "shipping_fee", nullable = false, precision = 15)
    private BigDecimal shippingFee;

    @NotNull
    @Column(name = "total_amount", nullable = false, precision = 15)
    private BigDecimal totalAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "coupon_id")
    private Coupon coupon;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 50)
    private PaymentMethodType paymentMethod;

    @NotNull
    @ColumnDefault("'PENDING'")
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", nullable = false, length = 50)
    private PaymentStatusType paymentStatus;

    @NotNull
    @ColumnDefault("'PENDING'")
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", nullable = false, length = 50)
    private OrderStatusType orderStatus;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_method", nullable = false, length = 50)
    private DeliveryMethodType deliveryMethod;

    @Size(max = 100)
    @Column(name = "tracking_code", length = 100)
    private String trackingCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "shipper_id")
    private Shipper shipper;

    @Lob
    @Column(name = "note")
    private String note;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

}