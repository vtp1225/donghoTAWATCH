package TAWactch.example.TAWatch.admin.repository;

import TAWactch.example.TAWatch.admin.entity.AdminLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminLogRepo extends JpaRepository<AdminLog, Integer> {
}
