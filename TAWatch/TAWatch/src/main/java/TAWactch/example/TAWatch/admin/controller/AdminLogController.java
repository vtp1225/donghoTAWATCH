package TAWactch.example.TAWatch.admin.controller;

import TAWactch.example.TAWatch.admin.dto.response.AdminLogResponse;
import TAWactch.example.TAWatch.admin.service.AdminLogService;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin-logs")
public class AdminLogController {

    @Autowired
    private AdminLogService adminLogService;

    @GetMapping
    public ApiResponse<List<AdminLogResponse>> getAllLogs() {
        ApiResponse<List<AdminLogResponse>> response = new ApiResponse<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(adminLogService.getAllLogs());
        return response;
    }
}
