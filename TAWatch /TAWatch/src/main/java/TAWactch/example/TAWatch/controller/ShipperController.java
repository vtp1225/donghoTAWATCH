package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.ShipperRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.ShipperResponse;
import TAWactch.example.TAWatch.service.ShipperService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shippers")
public class ShipperController {

    @Autowired private ShipperService shipperService;

    @GetMapping
    public ApiRespone<List<ShipperResponse>> getAll() {
        ApiRespone<List<ShipperResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(shipperService.getAll());
        return res;
    }

    @GetMapping("/active")
    public ApiRespone<List<ShipperResponse>> getActive() {
        ApiRespone<List<ShipperResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(shipperService.getActive());
        return res;
    }

    @GetMapping("/{id}")
    public ApiRespone<ShipperResponse> getById(@PathVariable Integer id) {
        ApiRespone<ShipperResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(shipperService.getById(id));
        return res;
    }

    @PostMapping
    public ApiRespone<ShipperResponse> create(@Valid @RequestBody ShipperRequest request) {
        ApiRespone<ShipperResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Tao shipper thanh cong");
        res.setData(shipperService.create(request));
        return res;
    }

    @PutMapping("/{id}")
    public ApiRespone<ShipperResponse> update(@PathVariable Integer id, @Valid @RequestBody ShipperRequest request) {
        ApiRespone<ShipperResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Cap nhat shipper thanh cong");
        res.setData(shipperService.update(id, request));
        return res;
    }

    @DeleteMapping("/{id}")
    public ApiRespone<Void> delete(@PathVariable Integer id) {
        shipperService.delete(id);
        ApiRespone<Void> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xoa shipper thanh cong");
        return res;
    }
}
