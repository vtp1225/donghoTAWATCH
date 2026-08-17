package TAWactch.example.TAWatch.order.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.order.dto.request.ShipperRequest;
import TAWactch.example.TAWatch.order.dto.response.ShipperResponse;
import TAWactch.example.TAWatch.order.service.ShipperService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shippers")
public class ShipperController {

    @Autowired private ShipperService shipperService;

    @GetMapping
    public ApiResponse<List<ShipperResponse>> getAll() {
        ApiResponse<List<ShipperResponse>> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(shipperService.getAll());
        return res;
    }

    @GetMapping("/active")
    public ApiResponse<List<ShipperResponse>> getActive() {
        ApiResponse<List<ShipperResponse>> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(shipperService.getActive());
        return res;
    }

    @GetMapping("/{id}")
    public ApiResponse<ShipperResponse> getById(@PathVariable Integer id) {
        ApiResponse<ShipperResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(shipperService.getById(id));
        return res;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "shippers")
    public ApiResponse<ShipperResponse> create(@Valid @RequestBody ShipperRequest request) {
        ApiResponse<ShipperResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Tao shipper thanh cong");
        res.setData(shipperService.create(request));
        return res;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "shippers")
    public ApiResponse<ShipperResponse> update(@PathVariable Integer id, @Valid @RequestBody ShipperRequest request) {
        ApiResponse<ShipperResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Cap nhat shipper thanh cong");
        res.setData(shipperService.update(id, request));
        return res;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "shippers")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        shipperService.delete(id);
        ApiResponse<Void> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Xoa shipper thanh cong");
        return res;
    }
}
