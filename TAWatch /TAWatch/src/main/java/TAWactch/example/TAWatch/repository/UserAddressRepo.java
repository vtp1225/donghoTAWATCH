package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepo extends JpaRepository<UserAddress, Integer> {
    List<UserAddress> findByUserId(Integer userId);
    Optional<UserAddress> findByIdAndUserId(Integer id, Integer userId);
    boolean existsByIdAndUserId(Integer id, Integer userId);

    @Modifying
    @Query("UPDATE UserAddress a SET a.isDefault = false WHERE a.user.id = :userId")
    void clearDefaultByUserId(Integer userId);
}
