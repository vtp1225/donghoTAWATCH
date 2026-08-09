package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.ImportReceiptItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImportReceiptItemRepo extends JpaRepository<ImportReceiptItem, Integer> {

    @Query("""
        SELECT i FROM ImportReceiptItem i
        JOIN FETCH i.watchVariant v
        JOIN FETCH v.watch w
        LEFT JOIN FETCH v.dialColor
        LEFT JOIN FETCH v.strapColor
        WHERE i.receipt.id = :receiptId
    """)
    List<ImportReceiptItem> findByReceiptId(@Param("receiptId") Integer receiptId);

    void deleteByReceiptId(Integer receiptId);

    void deleteByWatchVariantId(Integer watchVariantId);
}
