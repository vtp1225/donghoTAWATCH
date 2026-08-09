package TAWactch.example.TAWatch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@Embeddable
public class SupplierBrandId implements Serializable {
    private static final long serialVersionUID = 4920621521692414370L;
    @NotNull
    @Column(name = "supplier_id", nullable = false)
    private Integer supplierId;

    @NotNull
    @Column(name = "brand_id", nullable = false)
    private Integer brandId;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        SupplierBrandId entity = (SupplierBrandId) o;
        return Objects.equals(this.supplierId, entity.supplierId) &&
                Objects.equals(this.brandId, entity.brandId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(supplierId, brandId);
    }

}