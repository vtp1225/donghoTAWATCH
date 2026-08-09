package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.StoreSettingsRequest;
import TAWactch.example.TAWatch.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.StoreSettingsResponse;
import TAWactch.example.TAWatch.service.StoreSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
public class StoreSettingsController {

    @Autowired
    private StoreSettingsService service;

    @GetMapping
    public ApiRespone<StoreSettingsResponse> get() {
        ApiRespone<StoreSettingsResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(service.getSettings());
        return res;
    }

    @PutMapping
    @LogAdminActivity(action = "UPDATE", tableName = "store_settings")
    public ApiRespone<StoreSettingsResponse> update(@RequestBody StoreSettingsRequest req) {
        ApiRespone<StoreSettingsResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Cập nhật cài đặt thành công");
        res.setData(service.updateSettings(req));
        return res;
    }
}
