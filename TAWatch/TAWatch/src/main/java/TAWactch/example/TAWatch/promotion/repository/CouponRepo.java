package TAWactch.example.TAWatch.promotion.repository;

import TAWactch.example.TAWatch.promotion.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CouponRepo extends JpaRepository<Coupon, Integer> {
    Optional<Coupon> findByCode(String code);
    List<Coupon> findByUserIdAndIsUsedFalse(Integer userId);
}
