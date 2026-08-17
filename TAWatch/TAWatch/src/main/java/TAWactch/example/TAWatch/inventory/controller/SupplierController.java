package TAWactch.example.TAWatch.inventory.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.inventory.dto.request.SupplierRequest;
import TAWactch.example.TAWatch.inventory.dto.response.SupplierResponse;
import TAWactch.example.TAWatch.inventory.service.SupplierService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/suppliers")
public class SupplierController {

    @Autowired private SupplierService supplierService;

    @GetMapping
    public ApiResponse<List<SupplierResponse>> getAll() {
        ApiResponse<List<SupplierResponse>> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(supplierService.getAll());
        return res;
    }

    @GetMapping("/{id}")
    public ApiResponse<SupplierResponse> getById(@PathVariable Integer id) {
        ApiResponse<SupplierResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(supplierService.getById(id));
        return res;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "suppliers")
    public ApiResponse<SupplierResponse> create(@Valid @RequestBody SupplierRequest request) {
        ApiResponse<SupplierResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Tạo nhà cung cấp thành công");
        res.setData(supplierService.create(request));
        return res;
    }

    @PutMapping("/{id}")
    @LogAdminActivity(action = "UPDATE", tableName = "suppliers")
    public ApiResponse<SupplierResponse> update(@PathVariable Integer id, @Valid @RequestBody SupplierRequest request) {
        ApiResponse<SupplierResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Cập nhật nhà cung cấp thành công");
        res.setData(supplierService.update(id, request));
        return res;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "suppliers")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        supplierService.delete(id);
        ApiResponse<Void> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Xoá nhà cung cấp thành công");
        return res;
    }
}
