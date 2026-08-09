package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.dto.respone.AdminLogResponse;
import TAWactch.example.TAWatch.entity.AdminLog;
import TAWactch.example.TAWatch.repository.AdminLogRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminLogService {

    @Autowired
    private AdminLogRepo adminLogRepo;

    public List<AdminLogResponse> getAllLogs() {
        List<AdminLog> logs = adminLogRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return logs.stream().map(log -> new AdminLogResponse(
                log.getId(),
                log.getAdmin() != null ? log.getAdmin().getFullName() : "Unknown",
                log.getAdmin() != null ? log.getAdmin().getEmail() : "Unknown",
                log.getAction(),
                log.getTableName(),
                log.getIpAddress(),
                log.getNewValue(),
                log.getCreatedAt()
        )).toList();
    }
}
