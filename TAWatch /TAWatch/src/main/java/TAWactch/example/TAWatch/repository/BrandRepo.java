package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepo extends JpaRepository<Brand, Integer> {
    boolean existsByName(String name);
}
