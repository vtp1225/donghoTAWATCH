package TAWactch.example.TAWatch.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "user_address")
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Size(max = 200)
    @NotNull
    @Column(name = "recipient_name", nullable = false, length = 200)
    private String recipientName;

    @Size(max = 20)
    @NotNull
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @NotNull
    @Lob
    @Column(name = "address_detail", nullable = false)
    private String addressDetail;

    @Size(max = 100)
    @NotNull
    @Column(name = "province", nullable = false, length = 100)
    private String province;

    @Size(max = 100)
    @NotNull
    @Column(name = "district", nullable = false, length = 100)
    private String district;

    @Size(max = 100)
    @NotNull
    @Column(name = "ward", nullable = false, length = 100)
    private String ward;

    @NotNull
    @ColumnDefault("0")
    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

}