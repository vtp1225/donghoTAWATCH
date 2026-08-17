package TAWactch.example.TAWatch.payment.controller;

import TAWactch.example.TAWatch.common.dto.response.ApiResponse;
import TAWactch.example.TAWatch.payment.dto.request.BankTransferInitiateRequest;
import TAWactch.example.TAWatch.payment.dto.request.PaymentConfirmRequest;
import TAWactch.example.TAWatch.payment.dto.request.VnpayPaymentRequest;
import TAWactch.example.TAWatch.payment.dto.response.BankTransferInitiateResponse;
import TAWactch.example.TAWatch.payment.dto.response.PaymentTransactionResponse;
import TAWactch.example.TAWatch.payment.dto.response.VnpayInitiateResponse;
import TAWactch.example.TAWatch.payment.service.PaymentService;
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
    public ApiResponse<List<PaymentTransactionResponse>> getByOrder(@PathVariable Integer orderId) {
        ApiResponse<List<PaymentTransactionResponse>> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Success");
        res.setData(paymentService.getByOrderId(orderId));
        return res;
    }

    // POST /payments/vnpay/initiate — Khởi tạo thanh toán VNPay
    @PostMapping("/vnpay/initiate")
    public ApiResponse<VnpayInitiateResponse> initiateVnpay(@Valid @RequestBody VnpayPaymentRequest request) {
        ApiResponse<VnpayInitiateResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Khoi tao thanh toan VNPay thanh cong");
        res.setData(paymentService.initiateVnpay(request));
        return res;
    }

    // POST /payments/vnpay/callback — Frontend gửi params VNPay sau khi redirect về
    @PostMapping("/vnpay/callback")
    public ApiResponse<PaymentTransactionResponse> vnpayCallback(@RequestBody Map<String, String> payload) {
        ApiResponse<PaymentTransactionResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Xu ly callback VNPay thanh cong");
        res.setData(paymentService.handleVnpayCallback(payload));
        return res;
    }

    // POST /payments/bank-transfer/initiate — Lấy thông tin chuyển khoản
    @PostMapping("/bank-transfer/initiate")
    public ApiResponse<BankTransferInitiateResponse> initiateBankTransfer(
            @Valid @RequestBody BankTransferInitiateRequest request) {
        ApiResponse<BankTransferInitiateResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Lay thong tin chuyen khoan thanh cong");
        res.setData(paymentService.initiateBankTransfer(request));
        return res;
    }

    // PATCH /payments/{transactionId}/confirm — Admin xác nhận đã nhận tiền
    @PatchMapping("/{transactionId}/confirm")
    public ApiResponse<PaymentTransactionResponse> confirmBankTransfer(
            @PathVariable Integer transactionId,
            @RequestBody PaymentConfirmRequest request) {
        ApiResponse<PaymentTransactionResponse> res = new ApiResponse<>();
        res.setCode(200);
        res.setMessage("Xac nhan thanh toan thanh cong");
        res.setData(paymentService.confirmBankTransfer(transactionId, request));
        return res;
    }
}
