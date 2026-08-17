package TAWactch.example.TAWatch.order.repository;

import TAWactch.example.TAWatch.order.entity.Shipper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShipperRepo extends JpaRepository<Shipper, Integer> {
    boolean existsByName(String name);
    List<Shipper> findByIsActiveTrue();
}
