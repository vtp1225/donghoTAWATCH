package TAWactch.example.TAWatch.service;

import TAWactch.example.TAWatch.Enum.ErrorCode;
import TAWactch.example.TAWatch.Enum.GatewayType;
import TAWactch.example.TAWatch.Enum.PaymentMethodType;
import TAWactch.example.TAWatch.Enum.PaymentStatusType;
import TAWactch.example.TAWatch.dto.request.BankTransferInitiateRequest;
import TAWactch.example.TAWatch.dto.request.VnpayPaymentRequest;
import TAWactch.example.TAWatch.dto.request.PaymentConfirmRequest;
import TAWactch.example.TAWatch.dto.respone.BankTransferInitiateResponse;
import TAWactch.example.TAWatch.dto.respone.VnpayInitiateResponse;
import TAWactch.example.TAWatch.dto.respone.PaymentTransactionResponse;
import TAWactch.example.TAWatch.entity.Order;
import TAWactch.example.TAWatch.entity.PaymentTransaction;
import TAWactch.example.TAWatch.exception.AppException;
import TAWactch.example.TAWatch.repository.OrderRepo;
import TAWactch.example.TAWatch.repository.PaymentTransactionRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired private PaymentTransactionRepo transactionRepo;
    @Autowired private OrderRepo orderRepo;

    @Value("${app.bank.name:Vietcombank}")
    private String bankName;

    @Value("${app.bank.account-number:1234567890}")
    private String bankAccountNumber;

    @Value("${app.bank.account-name:CONG TY TAWATCH}")
    private String bankAccountName;

    @Value("${app.vnpay.payment-url:http://localhost:8080/tawatch/payments/vnpay/callback}")
    private String vnpayPaymentUrl;

    // -------------------------------------------------------
    // VNPay — Khởi tạo thanh toán
    // -------------------------------------------------------
    @Transactional
    public VnpayInitiateResponse initiateVnpay(VnpayPaymentRequest request) {
        Order order = requireOrder(request.orderId());
        validateOrderForPayment(order, PaymentMethodType.VNPAY);

        String txCode = "VNPAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();

        Map<String, Object> meta = new HashMap<>();
        meta.put("partnerCode", "TAWATCH");
        meta.put("requestId", txCode);
        meta.put("orderId", order.getOrderCode());

        PaymentTransaction tx = new PaymentTransaction();
        tx.setOrder(order);
        tx.setTransactionCode(txCode);
        tx.setGateway(GatewayType.VNPAY);
        tx.setAmount(order.getTotalAmount());
        tx.setStatus("PENDING");
        tx.setResponseData(meta);
        tx.setCreatedAt(Instant.now());
        tx.setUpdatedAt(Instant.now());
        tx = transactionRepo.save(tx);

        order.setPaymentStatus(PaymentStatusType.PENDING);
        orderRepo.save(order);

        // Trong thực tế sẽ gọi VNPay API để lấy paymentUrl
        String paymentUrl = vnpayPaymentUrl + "?txCode=" + txCode;

        return new VnpayInitiateResponse(tx.getId(), order.getOrderCode(), order.getTotalAmount(), paymentUrl, tx.getStatus());
    }

    // -------------------------------------------------------
    // VNPay — Callback từ gateway (gateway gọi vào)
    // -------------------------------------------------------
    @Transactional
    public PaymentTransactionResponse handleVnpayCallback(Map<String, Object> payload) {
        String txCode = (String) payload.get("transactionCode");
        String resultCode = String.valueOf(payload.getOrDefault("resultCode", "1"));

        PaymentTransaction tx = transactionRepo.findByTransactionCode(txCode)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_TRANSACTION_NOT_FOUND));

        if (!"PENDING".equals(tx.getStatus())) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
        }

        boolean success = "0".equals(resultCode);
        tx.setStatus(success ? "COMPLETED" : "FAILED");
        tx.setResponseData(payload);
        tx.setUpdatedAt(Instant.now());
        transactionRepo.save(tx);

        Order order = tx.getOrder();
        order.setPaymentStatus(success ? PaymentStatusType.PAID : PaymentStatusType.FAILED);
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);

        return toResponse(tx);
    }

    // -------------------------------------------------------
    // BANK_TRANSFER — Khởi tạo (lấy thông tin chuyển khoản)
    // -------------------------------------------------------
    @Transactional
    public BankTransferInitiateResponse initiateBankTransfer(BankTransferInitiateRequest request) {
        Order order = requireOrder(request.orderId());
        validateOrderForPayment(order, PaymentMethodType.BANK_TRANSFER);

        String txCode = "BT-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        String transferContent = "TAWATCH " + order.getOrderCode();

        Map<String, Object> meta = new HashMap<>();
        meta.put("bankName", bankName);
        meta.put("accountNumber", bankAccountNumber);
        meta.put("accountName", bankAccountName);
        meta.put("transferContent", transferContent);

        PaymentTransaction tx = new PaymentTransaction();
        tx.setOrder(order);
        tx.setTransactionCode(txCode);
        tx.setGateway(GatewayType.BANK_TRANSFER);
        tx.setAmount(order.getTotalAmount());
        tx.setStatus("PENDING");
        tx.setResponseData(meta);
        tx.setCreatedAt(Instant.now());
        tx.setUpdatedAt(Instant.now());
        tx = transactionRepo.save(tx);

        order.setPaymentStatus(PaymentStatusType.PENDING);
        orderRepo.save(order);

        return new BankTransferInitiateResponse(
                tx.getId(), order.getOrderCode(), order.getTotalAmount(),
                bankName, bankAccountNumber, bankAccountName, transferContent, tx.getStatus()
        );
    }

    // -------------------------------------------------------
    // BANK_TRANSFER — Admin xác nhận đã nhận tiền
    // -------------------------------------------------------
    @Transactional
    public PaymentTransactionResponse confirmBankTransfer(Integer transactionId, PaymentConfirmRequest request) {
        PaymentTransaction tx = transactionRepo.findById(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_TRANSACTION_NOT_FOUND));

        if (tx.getGateway() != GatewayType.BANK_TRANSFER) {
            throw new AppException(ErrorCode.PAYMENT_INVALID_METHOD);
        }
        if (!"PENDING".equals(tx.getStatus())) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
        }

        if (request.transactionCode() != null) {
            Map<String, Object> data = new HashMap<>(tx.getResponseData() != null ? tx.getResponseData() : Map.of());
            data.put("confirmedTransactionCode", request.transactionCode());
            data.put("note", request.note());
            tx.setResponseData(data);
        }
        tx.setStatus("COMPLETED");
        tx.setUpdatedAt(Instant.now());
        transactionRepo.save(tx);

        Order order = tx.getOrder();
        order.setPaymentStatus(PaymentStatusType.PAID);
        order.setUpdatedAt(Instant.now());
        orderRepo.save(order);

        return toResponse(tx);
    }

    // -------------------------------------------------------
    // Lấy lịch sử giao dịch của đơn hàng
    // -------------------------------------------------------
    public List<PaymentTransactionResponse> getByOrderId(Integer orderId) {
        requireOrder(orderId);
        return transactionRepo.findByOrderIdOrderByCreatedAtDesc(orderId)
                .stream().map(this::toResponse).toList();
    }

    // -------------------------------------------------------
    // Helpers
    // -------------------------------------------------------

    private Order requireOrder(Integer orderId) {
        return orderRepo.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    private void validateOrderForPayment(Order order, PaymentMethodType expectedMethod) {
        if (order.getPaymentMethod() != expectedMethod) {
            throw new AppException(ErrorCode.PAYMENT_INVALID_METHOD);
        }
        if (order.getPaymentStatus() == PaymentStatusType.PAID) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
        }
    }

    private PaymentTransactionResponse toResponse(PaymentTransaction tx) {
        return new PaymentTransactionResponse(
                tx.getId(),
                tx.getOrder().getId(),
                tx.getOrder().getOrderCode(),
                tx.getTransactionCode(),
                tx.getGateway(),
                tx.getAmount(),
                tx.getStatus(),
                tx.getResponseData(),
                tx.getCreatedAt(),
                tx.getUpdatedAt()
        );
    }
}
