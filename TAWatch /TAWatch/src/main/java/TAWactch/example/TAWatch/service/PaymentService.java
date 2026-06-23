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
import TAWactch.example.TAWatch.utils.VNPayUtil;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

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

    @Value("${app.vnpay.tmn-code:TAWATCH00}")
    private String vnpayTmnCode;

    @Value("${app.vnpay.hash-secret:your_hash_secret_here}")
    private String vnpayHashSecret;

    @Value("${app.vnpay.payment-url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpayPaymentUrl;

    @Value("${app.vnpay.return-url:http://localhost:5173/payment/vnpay-return}")
    private String vnpayReturnUrl;

    private static final DateTimeFormatter VNP_DATE_FMT =
            DateTimeFormatter.ofPattern("yyyyMMddHHmmss").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

    // -------------------------------------------------------
    // VNPay — Khởi tạo thanh toán (build URL thật)
    // -------------------------------------------------------
    @Transactional
    public VnpayInitiateResponse initiateVnpay(VnpayPaymentRequest request) {
        Order order = requireOrder(request.orderId());
        validateOrderForPayment(order, PaymentMethodType.VNPAY);

        String txCode = "VNPAY-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16).toUpperCase();
        String createDate = VNP_DATE_FMT.format(Instant.now());

        // Lưu transaction vào DB trước
        Map<String, Object> meta = new HashMap<>();
        meta.put("orderId", order.getOrderCode());
        meta.put("createDate", createDate);

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

        // Build params VNPay (không bao gồm vnp_SecureHash)
        Map<String, String> vnpParams = new TreeMap<>();
        vnpParams.put("vnp_Version", "2.1.0");
        vnpParams.put("vnp_Command", "pay");
        vnpParams.put("vnp_TmnCode", vnpayTmnCode);
        // VNPay yêu cầu amount * 100 (không có phần thập phân)
        long amountVnd = order.getTotalAmount().longValue() * 100L;
        vnpParams.put("vnp_Amount", String.valueOf(amountVnd));
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", txCode);
        vnpParams.put("vnp_OrderInfo", "Thanh toan don hang " + order.getOrderCode());
        vnpParams.put("vnp_OrderType", "other");
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpayReturnUrl);
        vnpParams.put("vnp_IpAddr", "127.0.0.1");
        vnpParams.put("vnp_CreateDate", createDate);

        // Hash trên raw values (không encode) — URL params encode riêng
        String rawHashString = VNPayUtil.buildRawHashString(vnpParams);
        String secureHash = VNPayUtil.hmacSHA512(vnpayHashSecret, rawHashString);
        String urlParams = VNPayUtil.buildQueryString(vnpParams);

        String paymentUrl = vnpayPaymentUrl + "?" + urlParams + "&vnp_SecureHash=" + secureHash;

        return new VnpayInitiateResponse(tx.getId(), order.getOrderCode(), order.getTotalAmount(), paymentUrl, tx.getStatus());
    }

    // -------------------------------------------------------
    // VNPay — Callback từ gateway (VNPay redirect về frontend, frontend gọi vào đây)
    // -------------------------------------------------------
    @Transactional
    public PaymentTransactionResponse handleVnpayCallback(Map<String, String> params) {
        // Debug log — xem params và hash thực tế để chẩn đoán sai chữ ký
        Map<String, String> filtered = new java.util.TreeMap<>(params);
        filtered.remove("vnp_SecureHash");
        filtered.remove("vnp_SecureHashType");
        String rawHashStr = VNPayUtil.buildRawHashString(filtered);
        String encodedHashStr = VNPayUtil.buildQueryString(filtered);
        System.out.println("=== VNPay callback params ===");
        params.forEach((k, v) -> System.out.println("  " + k + " = " + v));
        System.out.println("--- Raw hash string ---");
        System.out.println(rawHashStr);
        System.out.println("--- Encoded hash string ---");
        System.out.println(encodedHashStr);
        System.out.println("--- Received  vnp_SecureHash ---");
        System.out.println(params.get("vnp_SecureHash"));
        System.out.println("--- Computed (raw)     ---");
        System.out.println(VNPayUtil.hmacSHA512(vnpayHashSecret, rawHashStr));
        System.out.println("--- Computed (encoded) ---");
        System.out.println(VNPayUtil.hmacSHA512(vnpayHashSecret, encodedHashStr));
        System.out.println("--- Secret prefix (6 chars) ---");
        System.out.println(vnpayHashSecret.substring(0, Math.min(6, vnpayHashSecret.length())));
        System.out.println("=============================");

        // Verify checksum trước
        if (!VNPayUtil.verifySignature(params, vnpayHashSecret)) {
            throw new AppException(ErrorCode.PAYMENT_INVALID_SIGNATURE);
        }

        String txCode = params.get("vnp_TxnRef");
        String responseCode = params.getOrDefault("vnp_ResponseCode", "99");

        PaymentTransaction tx = transactionRepo.findByTransactionCode(txCode)
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_TRANSACTION_NOT_FOUND));

        if (!"PENDING".equals(tx.getStatus())) {
            throw new AppException(ErrorCode.PAYMENT_ALREADY_PROCESSED);
        }

        boolean success = "00".equals(responseCode);
        tx.setStatus(success ? "COMPLETED" : "FAILED");
        tx.setResponseData(new HashMap<>(params));
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
