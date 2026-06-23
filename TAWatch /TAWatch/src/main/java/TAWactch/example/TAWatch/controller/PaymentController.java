package TAWactch.example.TAWatch.controller;

import TAWactch.example.TAWatch.dto.request.BankTransferInitiateRequest;
import TAWactch.example.TAWatch.dto.request.VnpayPaymentRequest;
import TAWactch.example.TAWatch.dto.request.PaymentConfirmRequest;
import TAWactch.example.TAWatch.dto.respone.ApiRespone;
import TAWactch.example.TAWatch.dto.respone.BankTransferInitiateResponse;
import TAWactch.example.TAWatch.dto.respone.VnpayInitiateResponse;
import TAWactch.example.TAWatch.dto.respone.PaymentTransactionResponse;
import TAWactch.example.TAWatch.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    @Autowired private PaymentService paymentService;

    // GET /payments/order/{orderId} — Lịch sử giao dịch của đơn hàng
    @GetMapping("/order/{orderId}")
    public ApiRespone<List<PaymentTransactionResponse>> getByOrder(@PathVariable Integer orderId) {
        ApiRespone<List<PaymentTransactionResponse>> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(paymentService.getByOrderId(orderId));
        return res;
    }

    // POST /payments/vnpay/initiate — Khởi tạo thanh toán VNPay
    @PostMapping("/vnpay/initiate")
    public ApiRespone<VnpayInitiateResponse> initiateVnpay(@Valid @RequestBody VnpayPaymentRequest request) {
        ApiRespone<VnpayInitiateResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Khoi tao thanh toan VNPay thanh cong");
        res.setData(paymentService.initiateVnpay(request));
        return res;
    }

    // POST /payments/vnpay/callback — Frontend gửi params VNPay sau khi redirect về
    @PostMapping("/vnpay/callback")
    public ApiRespone<PaymentTransactionResponse> vnpayCallback(@RequestBody Map<String, String> payload) {
        ApiRespone<PaymentTransactionResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xu ly callback VNPay thanh cong");
        res.setData(paymentService.handleVnpayCallback(payload));
        return res;
    }

    // POST /payments/bank-transfer/initiate — Lấy thông tin chuyển khoản
    @PostMapping("/bank-transfer/initiate")
    public ApiRespone<BankTransferInitiateResponse> initiateBankTransfer(
            @Valid @RequestBody BankTransferInitiateRequest request) {
        ApiRespone<BankTransferInitiateResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Lay thong tin chuyen khoan thanh cong");
        res.setData(paymentService.initiateBankTransfer(request));
        return res;
    }

    // PATCH /payments/{transactionId}/confirm — Admin xác nhận đã nhận tiền
    @PatchMapping("/{transactionId}/confirm")
    public ApiRespone<PaymentTransactionResponse> confirmBankTransfer(
            @PathVariable Integer transactionId,
            @RequestBody PaymentConfirmRequest request) {
        ApiRespone<PaymentTransactionResponse> res = new ApiRespone<>();
        res.setCode(200);
        res.setMessage("Xac nhan thanh toan thanh cong");
        res.setData(paymentService.confirmBankTransfer(transactionId, request));
        return res;
    }
}
