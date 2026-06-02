package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentTransactionRepo extends JpaRepository<PaymentTransaction, Integer> {
    List<PaymentTransaction> findByOrderIdOrderByCreatedAtDesc(Integer orderId);
    Optional<PaymentTransaction> findByTransactionCode(String transactionCode);
}
