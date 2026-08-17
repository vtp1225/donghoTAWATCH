package TAWactch.example.TAWatch.inventory.repository;

import TAWactch.example.TAWatch.inventory.entity.ImportReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ImportReceiptRepo extends JpaRepository<ImportReceipt, Integer> {

    @Query("SELECT r FROM ImportReceipt r JOIN FETCH r.supplier JOIN FETCH r.createdBy ORDER BY r.createdAt DESC")
    List<ImportReceipt> findAllWithDetails();

    @Query("SELECT r FROM ImportReceipt r JOIN FETCH r.supplier JOIN FETCH r.createdBy WHERE r.id = :id")
    Optional<ImportReceipt> findByIdWithDetails(Integer id);

    boolean existsByReceiptCode(String receiptCode);
}
