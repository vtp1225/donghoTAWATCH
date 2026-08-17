package TAWactch.example.TAWatch.inventory.repository;

import TAWactch.example.TAWatch.inventory.entity.SupplierBrand;
import TAWactch.example.TAWatch.inventory.entity.SupplierBrandId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierBrandRepo extends JpaRepository<SupplierBrand, SupplierBrandId> {
    @Query("SELECT sb FROM SupplierBrand sb JOIN FETCH sb.brand WHERE sb.supplier.id = :supplierId")
    List<SupplierBrand> findBySupplierId(@Param("supplierId") Integer supplierId);

    void deleteBySupplierId(Integer supplierId);
}
