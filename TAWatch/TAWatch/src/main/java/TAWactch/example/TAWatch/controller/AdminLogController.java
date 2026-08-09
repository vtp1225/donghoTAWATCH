package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.respone.AdminLogResponse;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.service.AdminLogService;
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
    public ApiRespone<List<AdminLogResponse>> getAllLogs() {
        ApiRespone<List<AdminLogResponse>> response = new ApiRespone<>();
        response.setCode(200);
        response.setMessage("Success");
        response.setData(adminLogService.getAllLogs());
        return response;
    }
}
