package TAWactch.example.TAWatch.common.aspect;

import TAWactch.example.TAWatch.admin.entity.AdminLog;
import TAWactch.example.TAWatch.admin.repository.AdminLogRepo;
import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.user.entity.User;
import TAWactch.example.TAWatch.user.repository.UserRepo;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.Map;

@Aspect
@Component
public class AdminLogAspect {

    @Autowired
    private AdminLogRepo adminLogRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    @Lazy
    private ObjectMapper objectMapper;

    @Around("@annotation(TAWactch.example.TAWatch.common.annotation.LogAdminActivity)")
    public Object logActivity(ProceedingJoinPoint joinPoint) throws Throwable {
        
        Object result = joinPoint.proceed();

        try {
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            LogAdminActivity annotation = signature.getMethod().getAnnotation(LogAdminActivity.class);
            
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            String ipAddress = null;
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = request.getRemoteAddr();
            }

            String email = null;
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                email = SecurityContextHolder.getContext().getAuthentication().getName();
            }

            if (email != null) {
                User admin = userRepo.findByEmail(email).orElse(null);

                if (admin != null) {
                    AdminLog log = new AdminLog();
                    log.setAdmin(admin);
                    log.setAction(annotation.action());
                    log.setTableName(annotation.tableName());
                    log.setIpAddress(ipAddress);
                    log.setCreatedAt(Instant.now());

                    Object[] args = joinPoint.getArgs();
                    Map<String, Object> summary = new java.util.HashMap<>();
                    
                    for (Object arg : args) {
                        if (arg == null) continue;
                        if (arg instanceof Integer || arg instanceof Long || arg instanceof String) {
                            if (!summary.containsKey("id")) {
                                summary.put("id", arg);
                            }
                        } else {
                            try {
                                Map<String, Object> map = objectMapper.convertValue(arg, Map.class);
                                if (map.containsKey("name")) summary.put("name", map.get("name"));
                                if (map.containsKey("title")) summary.put("title", map.get("title"));
                                if (map.containsKey("code")) summary.put("code", map.get("code"));
                                if (map.containsKey("orderCode")) summary.put("orderCode", map.get("orderCode"));
                                if (map.containsKey("newStatus")) summary.put("status", map.get("newStatus"));
                                else if (map.containsKey("status")) summary.put("status", map.get("status"));
                                if (map.containsKey("isActive")) summary.put("isActive", map.get("isActive"));
                                if (map.containsKey("isFeatured")) summary.put("isFeatured", map.get("isFeatured"));
                            } catch (Exception e) {
                                // Bỏ qua
                            }
                        }
                    }

                    // Extract name/code from result if missing
                    if (result != null) {
                        try {
                            Map<String, Object> resultMap = objectMapper.convertValue(result, Map.class);
                            if (resultMap.containsKey("data") && resultMap.get("data") != null) {
                                Map<String, Object> dataMap = objectMapper.convertValue(resultMap.get("data"), Map.class);
                                if (!summary.containsKey("name") && dataMap.containsKey("name")) summary.put("name", dataMap.get("name"));
                                if (!summary.containsKey("title") && dataMap.containsKey("title")) summary.put("title", dataMap.get("title"));
                                if (!summary.containsKey("code") && dataMap.containsKey("code")) summary.put("code", dataMap.get("code"));
                                if (!summary.containsKey("orderCode") && dataMap.containsKey("orderCode")) summary.put("orderCode", dataMap.get("orderCode"));
                                if (!summary.containsKey("status") && dataMap.containsKey("orderStatus")) summary.put("status", dataMap.get("orderStatus"));
                                if (!summary.containsKey("isActive") && dataMap.containsKey("active")) summary.put("isActive", dataMap.get("active"));
                            }
                        } catch (Exception e) {
                            // Bỏ qua
                        }
                    }
                    
                    if (summary.isEmpty()) {
                        summary.put("info", "Updated");
                    }
                    log.setNewValue(summary);

                    adminLogRepo.save(log);
                }
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi ghi Admin Log: " + e.getMessage());
        }

        return result;
    }
}
