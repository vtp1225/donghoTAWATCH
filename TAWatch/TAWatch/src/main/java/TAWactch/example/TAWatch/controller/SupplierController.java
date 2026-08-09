package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.SupplierRequest;
import TAWactch.example.TAWatch.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.SupplierResponse;
import TAWactch.example.TAWatch.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired private SupplierService supplierService;

    @GetMapping
    public ApiRespone<List<SupplierResponse>> getAll() {
        ApiRespone<List<SupplierResponse>> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(supplierService.getAll());
        return res;
    }

    @GetMapping("/{id}")
    public ApiRespone<SupplierResponse> getById(@PathVariable Integer id) {
        ApiRespone<SupplierResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(supplierService.getById(id));
        return res;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "suppliers")
    public ApiRespone<SupplierResponse> create(@Valid @RequestBody SupplierRequest request) {
        ApiRespone<SupplierResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Tạo nhà cung cấp thành công");
        res.setData(supplierService.create(request));
        return res;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "suppliers")
    public ApiRespone<SupplierResponse> update(@PathVariable Integer id, @Valid @RequestBody SupplierRequest request) {
        ApiRespone<SupplierResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Cập nhật nhà cung cấp thành công");
        res.setData(supplierService.update(id, request));
        return res;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "suppliers")
    public ApiRespone<Void> delete(@PathVariable Integer id) {
        supplierService.delete(id);
        ApiRespone<Void> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Xoá nhà cung cấp thành công");
        return res;
    }
}
