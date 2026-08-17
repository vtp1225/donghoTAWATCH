package TAWactch.example.TAWatch.inventory.controller;

import TAWactch.example.TAWatch.common.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.inventory.dto.request.ImportReceiptRequest;
import TAWactch.example.TAWatch.inventory.dto.response.ImportReceiptResponse;
import TAWactch.example.TAWatch.inventory.service.ImportReceiptService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/import-receipts")
public class ImportReceiptController {

    @Autowired private ImportReceiptService service;

    @GetMapping
    public ApiResponse<List<ImportReceiptResponse>> getAll() {
        ApiResponse<List<ImportReceiptResponse>> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(service.getAll());
        return res;
    }

    @GetMapping("/{id}")
    public ApiResponse<ImportReceiptResponse> getById(@PathVariable Integer id) {
        ApiResponse<ImportReceiptResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(service.getById(id));
        return res;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "import_receipts")
    public ApiResponse<ImportReceiptResponse> create(@Valid @RequestBody ImportReceiptRequest request) {
        ApiResponse<ImportReceiptResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Tạo phiếu nhập kho thành công");
        res.setData(service.create(request));
        return res;
    }

    @PatchMapping("/{id}/confirm")
    @LogAdminActivity(action = "UPDATE", tableName = "import_receipts")
    public ApiResponse<ImportReceiptResponse> confirm(@PathVariable Integer id) {
        ApiResponse<ImportReceiptResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Xác nhận nhập kho thành công");
        res.setData(service.confirm(id));
        return res;
    }

    @PatchMapping("/{id}/cancel")
    @LogAdminActivity(action = "UPDATE", tableName = "import_receipts")
    public ApiResponse<ImportReceiptResponse> cancel(@PathVariable Integer id) {
        ApiResponse<ImportReceiptResponse> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Huỷ phiếu nhập kho thành công");
        res.setData(service.cancel(id));
        return res;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "import_receipts")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        ApiResponse<Void> res = new ApiResponse<>();
        res.setCode(200); res.setMessage("Xoá phiếu nhập kho thành công");
        return res;
    }
}
