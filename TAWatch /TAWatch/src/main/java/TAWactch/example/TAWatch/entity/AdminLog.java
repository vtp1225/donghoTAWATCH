package TAWactch.example.TAWatch.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "admin_log", indexes = {
        @Index(name = "idx_admin_log_admin", columnList = "admin_id, created_at")
})
public class AdminLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Size(max = 100)
    @NotNull
    @Column(name = "action", nullable = false, length = 100)
    private String action;

    @Size(max = 100)
    @NotNull
    @Column(name = "table_name", nullable = false, length = 100)
    private String tableName;

    @Column(name = "record_id")
    private Integer recordId;

    @Column(name = "old_value")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> oldValue;

    @Column(name = "new_value")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> newValue;

    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @NotNull
    @ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

}