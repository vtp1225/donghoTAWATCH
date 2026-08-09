package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepo extends JpaRepository<Supplier, Integer> {
    boolean existsByEmail(String email);
    List<Supplier> findAllByOrderByCreatedAtDesc();
}
