package TAWactch.example.TAWatch.admin.controller;

import TAWactch.example.TAWatch.admin.dto.request.StoreSettingsRequest;
import TAWactch.example.TAWatch.admin.dto.response.StoreSettingsResponse;
import TAWactch.example.TAWatch.admin.service.StoreSettingsService;
import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
public class StoreSettingsController {

    @Autowired
    private StoreSettingsService service;

    @GetMapping
    public ApiResponse<StoreSettingsResponse> get() {
        ApiResponse<StoreSettingsResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(service.getSettings());
        return res;
    }

    @PutMapping
    @LogAdminActivity(action = "UPDATE", tableName = "store_settings")
    public ApiResponse<StoreSettingsResponse> update(@RequestBody StoreSettingsRequest req) {
        ApiResponse<StoreSettingsResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Cập nhật cài đặt thành công");
        res.setData(service.updateSettings(req));
        return res;
    }
}
