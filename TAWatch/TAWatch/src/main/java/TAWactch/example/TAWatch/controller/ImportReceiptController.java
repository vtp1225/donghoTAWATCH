package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.ImportReceiptRequest;
import TAWactch.example.TAWatch.annotation.LogAdminActivity;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.ImportReceiptResponse;
import TAWactch.example.TAWatch.service.ImportReceiptService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/import-receipts")
public class ImportReceiptController {

    @Autowired private ImportReceiptService service;

    @GetMapping
    public ApiRespone<List<ImportReceiptResponse>> getAll() {
        ApiRespone<List<ImportReceiptResponse>> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(service.getAll());
        return res;
    }

    @GetMapping("/{id}")
    public ApiRespone<ImportReceiptResponse> getById(@PathVariable Integer id) {
        ApiRespone<ImportReceiptResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Success");
        res.setData(service.getById(id));
        return res;
    }

    @PostMapping
    @LogAdminActivity(action = "CREATE", tableName = "import_receipts")
    public ApiRespone<ImportReceiptResponse> create(@Valid @RequestBody ImportReceiptRequest request) {
        ApiRespone<ImportReceiptResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Tạo phiếu nhập kho thành công");
        res.setData(service.create(request));
        return res;
    }

    @PatchMapping("/{id}/confirm")
    @LogAdminActivity(action = "UPDATE", tableName = "import_receipts")
    public ApiRespone<ImportReceiptResponse> confirm(@PathVariable Integer id) {
        ApiRespone<ImportReceiptResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Xác nhận nhập kho thành công");
        res.setData(service.confirm(id));
        return res;
    }

    @PatchMapping("/{id}/cancel")
    @LogAdminActivity(action = "UPDATE", tableName = "import_receipts")
    public ApiRespone<ImportReceiptResponse> cancel(@PathVariable Integer id) {
        ApiRespone<ImportReceiptResponse> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Huỷ phiếu nhập kho thành công");
        res.setData(service.cancel(id));
        return res;
    }

    @DeleteMapping("/{id}")
    @LogAdminActivity(action = "DELETE", tableName = "import_receipts")
    public ApiRespone<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        ApiRespone<Void> res = new ApiRespone<>();
        res.setCode(200); res.setMessage("Xoá phiếu nhập kho thành công");
        return res;
    }
}
