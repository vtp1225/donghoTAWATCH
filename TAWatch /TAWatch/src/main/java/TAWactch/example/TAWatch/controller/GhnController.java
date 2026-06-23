package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.service.GhnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ghn")
public class GhnController {

    @Autowired
    private GhnService ghnService;

    // GET /ghn/provinces
    @GetMapping("/provinces")
    public ApiRespone<List<Map<String, Object>>> getProvinces() {
        ApiRespone<List<Map<String, Object>>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(ghnService.getProvinces());
        return res;
    }

    // GET /ghn/districts?provinceId=201
    @GetMapping("/districts")
    public ApiRespone<List<Map<String, Object>>> getDistricts(@RequestParam Integer provinceId) {
        ApiRespone<List<Map<String, Object>>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(ghnService.getDistricts(provinceId));
        return res;
    }

    // GET /ghn/wards?districtId=1442
    @GetMapping("/wards")
    public ApiRespone<List<Map<String, Object>>> getWards(@RequestParam Integer districtId) {
        ApiRespone<List<Map<String, Object>>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(ghnService.getWards(districtId));
        return res;
    }

    // POST /ghn/fee
    // Body: { "toDistrictId": 1442, "toWardCode": "1A0107", "weight": 500, "insuranceValue": 1000000 }
    @PostMapping("/fee")
    public ApiRespone<Map<String, Object>> calculateFee(@RequestBody Map<String, Object> body) {
        Integer toDistrictId = (Integer) body.get("toDistrictId");
        String toWardCode = (String) body.get("toWardCode");
        Integer weight = body.get("weight") != null ? (Integer) body.get("weight") : 500;
        Integer insuranceValue = body.get("insuranceValue") != null ? (Integer) body.get("insuranceValue") : 0;

        Integer fee = ghnService.calculateFee(toDistrictId, toWardCode, weight, insuranceValue);

        ApiRespone<Map<String, Object>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(Map.of("total", fee));
        return res;
    }
}
