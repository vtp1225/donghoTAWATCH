package TAWactch.example.TAWatch.repository;

import TAWactch.example.TAWatch.entity.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminLogRepo extends JpaRepository<AdminLog, Integer> {
}
