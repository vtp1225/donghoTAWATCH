# Giải thích toàn bộ codebase TAWatch

## Mục lục
1. [Tổng quan kiến trúc](#1-tổng-quan-kiến-trúc)
2. [Pattern chung — CRUD modules](#2-pattern-chung--crud-modules)
3. [Xử lý lỗi — AppException + ErrorCode](#3-xử-lý-lỗi--appexception--errorcode)
4. [Bảo mật — JWT + Spring Security](#4-bảo-mật--jwt--spring-security)
5. [Auth — Đăng ký / Đăng nhập / Đặt lại mật khẩu](#5-auth--đăng-ký--đăng-nhập--đặt-lại-mật-khẩu)
6. [OTP — Xác thực email và quên mật khẩu](#6-otp--xác-thực-email-và-quên-mật-khẩu)
7. [Email — Gửi bất đồng bộ](#7-email--gửi-bất-đồng-bộ)
8. [Cart — Giỏ hàng cho cả guest và user](#8-cart--giỏ-hàng-cho-cả-guest-và-user)
9. [Order — Đặt hàng và quản lý đơn](#9-order--đặt-hàng-và-quản-lý-đơn)
10. [Payment — VNPay và Bank Transfer](#10-payment--vnpay-và-bank-transfer)
11. [DataInitializer — Tài khoản admin mặc định](#11-datainitializer--tài-khoản-admin-mặc-định)
12. [Vấn đề cần chú ý](#12-vấn-đề-cần-chú-ý)

---

## 1. Tổng quan kiến trúc

Đây là **Spring Boot REST API** cho cửa hàng đồng hồ TAWatch. Luồng chính:

```
Request → SecurityFilter (JWT) → Controller → Service → Repository → DB (MySQL)
```

Các tầng:
| Tầng | Vai trò |
|---|---|
| `controller/` | Nhận HTTP request, gọi service, trả `ApiRespone<T>` |
| `service/` | Toàn bộ business logic |
| `repository/` | Interface JPA — truy vấn DB |
| `entity/` | Ánh xạ bảng DB |
| `dto/request/` | Object nhận từ client |
| `dto/respone/` | Object trả về client |
| `mapper/` | Chuyển đổi entity ↔ DTO (dùng MapStruct) |
| `Enum/` | Các tập giá trị cố định |
| `security/` | JWT, filter, phân quyền |
| `exception/` | Xử lý lỗi tập trung |

---

## 2. Pattern chung — CRUD modules

Các module sau **đều có cùng cấu trúc**, chỉ khác tên entity:

> **Brand, Category, Segment, Watch, WatchVariant, WatchImage, WatchVariantImage, Shipper, UserAddress, User**

**Mỗi module gồm:**
- `XxxController` → nhận request, gọi `XxxService`, trả `ApiRespone<XxxResponse>`
- `XxxService` → validate + CRUD, ném `AppException` nếu lỗi
- `XxxRepo` → `extends JpaRepository<Xxx, Integer>`
- `XxxMapper` → MapStruct, convert entity → response DTO
- `XxxRequest` → record Java nhận input
- `XxxResponse` → record Java trả output

**Ví dụ luồng tạo Brand:**
```
POST /brands
  → BrandController.create(BrandRequest)
  → BrandService.create()  → kiểm tra tên trùng → lưu DB
  → BrandMapper.toResponse(entity)
  → ApiRespone { code: 0, data: BrandResponse }
```

**Phân quyền đồng nhất cho tất cả CRUD modules:**
- `GET` → public (ai cũng xem được)
- `POST / PUT / DELETE` → chỉ `ROLE_ADMIN`

---

## 3. Xử lý lỗi — AppException + ErrorCode

Đây là cơ chế xử lý lỗi **tập trung**, dùng xuyên suốt toàn app.

### AppException
```java
throw new AppException(ErrorCode.USER_NOT_FOUND);
```
Là một `RuntimeException` bọc `ErrorCode`. Khi throw ở bất kỳ đâu trong service, `GlobalExceptionHandler` sẽ bắt và trả về response chuẩn.

### ErrorCode
Enum chứa tất cả mã lỗi của hệ thống, phân nhóm theo domain:

| Nhóm | Dải mã | Ví dụ |
|---|---|---|
| User | 1001–1008 | `USER_NOT_FOUND`, `WRONG_PASSWORD` |
| Watch/Brand/... | 2001–2013 | `WATCH_NOT_FOUND`, `BRAND_NAME_EXISTS` |
| Address | 3001–3002 | `ADDRESS_NOT_BELONG_TO_USER` |
| Cart | 4001–4005 | `CART_ITEM_ALREADY_EXISTS` |
| Order | 5001–5010 | `INSUFFICIENT_STOCK`, `INVALID_STATUS_TRANSITION` |
| OTP | 6001–6007 | `OTP_MAX_ATTEMPTS`, `OTP_SEND_TOO_SOON` |
| Payment | 7001–7004 | `PAYMENT_ALREADY_PROCESSED` |
| Shipper | 8001–8004 | `ORDER_TRACKING_REQUIRES_SHIPPING` |

### GlobalExceptionHandler
Bắt 3 loại exception:
1. `AppException` → trả `code` + `message` từ `ErrorCode`
2. `MethodArgumentNotValidException` → lỗi validate Bean Validation (`@Valid`), chuyển field message thành `ErrorCode`
3. `Exception` chung → trả code 9999

### ApiRespone\<T\>
Wrapper chuẩn cho mọi response:
```json
{ "code": 0, "message": "...", "data": { ... } }
```
Dùng `@JsonInclude(NON_NULL)` → field nào null thì không xuất ra JSON.

---

## 4. Bảo mật — JWT + Spring Security

### JwtUtil — Tạo và xác thực token
Dùng thư viện **Nimbus JOSE** (không phải `io.jsonwebtoken`). Tạo JWT ký bằng HMAC-SHA256.

**Có 2 loại token:**

| Loại | Dùng cho | Thời hạn | Claim đặc biệt |
|---|---|---|---|
| Access token | Đăng nhập bình thường | Cấu hình `jwt.expiration` | không có |
| Reset token | Đặt lại mật khẩu | Cứng 15 phút | `"type": "RESET_PASSWORD"` |

Tại sao phân biệt reset token? Để tránh dùng nhầm reset token như một access token đăng nhập. Method `isResetToken()` kiểm tra claim `type == "RESET_PASSWORD"` trước khi cho phép đổi mật khẩu.

### JwtAuthenticationFilter
Chạy trước **mọi request** (extends `OncePerRequestFilter`):
1. Đọc header `Authorization: Bearer <token>`
2. Nếu không có → cho qua (public API)
3. Nếu có → validate token → load user từ DB → đưa vào `SecurityContext`

### SecurityConfig — Phân quyền per-endpoint
Stateless (không dùng session). Quy tắc phân quyền được khai báo rõ ràng từng endpoint:
- `/auth/**`, `/otp/**`, Swagger → public
- CRUD danh mục/sản phẩm: GET public, POST/PUT/DELETE → ADMIN
- `/users/*/addresses/**` → khai báo **trước** `/users/**` để rule cụ thể hơn không bị rule chung nuốt mất
- Cart → public hoàn toàn (vì hỗ trợ guest)
- Order đặt hàng → public; xem đơn của mình → authenticated; quản lý → ADMIN/STAFF
- Payment callback (VNPay gọi vào) → public

---

## 5. Auth — Đăng ký / Đăng nhập / Đặt lại mật khẩu

**Đăng ký (`register`):**
1. Kiểm tra email chưa tồn tại
2. Mã hoá mật khẩu bằng BCrypt
3. Tạo `User` với `role = CUSTOMER`, `isVerified = false`
4. **Tự động tạo `Cart` trống** cho user ngay khi đăng ký
5. Trả về JWT token luôn (không cần đăng nhập lại)

**Đăng nhập (`login`):**
1. Tìm user theo email
2. Kiểm tra `isActive`
3. Kiểm tra password bằng `BCrypt.matches()`
4. Trả về JWT token

**Đặt lại mật khẩu (`resetPassword`):**
- Nhận `resetToken` (JWT đặc biệt loại RESET_PASSWORD) + `newPassword`
- Validate token bằng `jwtUtil.isResetToken()` (kiểm tra chữ ký + hạn + claim type)
- Không yêu cầu mật khẩu cũ — chỉ cần token hợp lệ từ flow OTP

---

## 6. OTP — Xác thực email và quên mật khẩu

Đây là module **phức tạp nhất** sau Order. Có nhiều cơ chế bảo vệ:

### 3 mục đích (PurposeType)
| Purpose | Dùng khi |
|---|---|
| `VERIFY_EMAIL` | Xác thực email sau đăng ký |
| `RESET_PASSWORD` | Quên mật khẩu |
| `CHANGE_EMAIL` | Đổi địa chỉ email |

### Cơ chế bảo vệ khi gửi OTP
1. **Cooldown 60 giây** — không gửi lại trong vòng 1 phút (tránh spam)
2. **Vô hiệu hoá OTP cũ** — khi gửi mới, tất cả OTP cũ cùng email+purpose bị đánh dấu invalid
3. OTP là 6 chữ số ngẫu nhiên, dùng `SecureRandom` (an toàn hơn `Random`)
4. Hết hạn sau **5 phút**

### Cơ chế bảo vệ khi xác thực OTP
1. **Tối đa 5 lần nhập sai** — vượt quá tự động khoá OTP đó
2. Mỗi lần sai tăng `attempts` thêm 1 và lưu DB
3. Sau khi dùng đúng → đánh dấu `isUsed = true`

### Kết quả khác nhau theo purpose
- `VERIFY_EMAIL` → set `user.isVerified = true`
- `RESET_PASSWORD` → tạo và trả về **reset token** (JWT 15 phút) để client dùng đặt lại mật khẩu
- `CHANGE_EMAIL` → chỉ trả `success = true` (logic đổi email chưa implement)

### Flag `showOtpInResponse`
Cấu hình `app.mail.show-otp-in-response=true` → OTP code được trả thẳng vào response (dùng khi dev/test, không cần email thật).

---

## 7. Email — Gửi bất đồng bộ

**Điểm đặc biệt:**

1. **`@Async`** — method `sendOtpEmail` chạy trên thread riêng, không block HTTP request. Người dùng nhận response ngay lập tức dù email chưa gửi xong.

2. **`@Autowired(required = false)`** — `JavaMailSender` là optional. Nếu chưa cấu hình SMTP trong `application.properties`, app **vẫn khởi động được** và chỉ in OTP ra console thay vì crash.

3. Email template dạng **HTML đẹp** với inline CSS, responsive, có OTP box nổi bật.

---

## 8. Cart — Giỏ hàng cho cả guest và user

**Điểm đặc biệt: hỗ trợ 2 loại người dùng**

| Loại | Định danh | Cách lấy cart |
|---|---|---|
| User đã đăng ký | `userId` | `GET /cart/user/{userId}` |
| Khách (guest) | `sessionId` (do FE tự tạo) | `GET /cart/session/{sessionId}` |

Cả hai đều dùng chung bảng `cart`. Nếu chưa có cart → tự tạo mới (`getOrCreate` pattern).

**Luồng thêm item:**
1. Kiểm tra variant tồn tại và `isActive = true`
2. Kiểm tra item chưa có trong cart (nếu đã có → lỗi `CART_ITEM_ALREADY_EXISTS`, không cộng dồn)
3. Lưu `unitPrice` tại thời điểm thêm (tránh giá thay đổi sau)

**Response cart** tự tính `subtotal` từng item và `total` toàn giỏ ở tầng service (không lưu vào DB).

---

## 9. Order — Đặt hàng và quản lý đơn

Module lớn nhất, nhiều nghiệp vụ nhất.

### Đặt hàng (`placeOrder`)
Luồng xử lý theo thứ tự:
1. Validate danh sách items không rỗng
2. Resolve user (nếu có) hoặc guest
3. **Build shipping snapshot** — chụp địa chỉ giao hàng thành JSON string ngay lúc đặt. Sau này địa chỉ có thay đổi thì đơn hàng vẫn giữ đúng địa chỉ ban đầu
4. Validate từng variant: còn active không, đủ tồn kho không
5. Tính subtotal
6. Áp coupon (nếu có) → validate và tính discount
7. Tạo Order, tạo từng OrderItem
8. **Trừ kho** ngay khi đặt hàng (không chờ xác nhận)
9. Đánh dấu coupon đã dùng
10. Tạo bản ghi `OrderStatusHistory` đầu tiên

### Snapshot sản phẩm
Mỗi `OrderItem` lưu `productSnapshot` (JSON) gồm: tên, thương hiệu, màu, size, giá, ảnh tại thời điểm mua. Đảm bảo đơn hàng không bị ảnh hưởng khi sản phẩm bị sửa/xóa sau này.

### Mã đơn hàng
```
ORD-20260528-3456789
      ↑            ↑
   ngày đặt   7 ký số cuối của timestamp
```

### State machine trạng thái đơn hàng
Chỉ cho phép chuyển theo đúng thứ tự, không được nhảy cóc:
```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED → REFUNDED
   ↓           ↓
CANCELLED   CANCELLED
```
Nếu chuyển sai bước → lỗi `INVALID_STATUS_TRANSITION`.

### Huỷ đơn
- Chỉ huỷ được khi `PENDING`
- **Hoàn kho** tự động khi huỷ

### Gán shipper và tracking
- Gán shipper: chỉ khi đơn `CONFIRMED` hoặc `PROCESSING`
- Cập nhật mã vận đơn: chỉ khi đơn đang `SHIPPING`

---

## 10. Payment — VNPay và Bank Transfer

### VNPay (thanh toán tự động)
```
Client → POST /payments/vnpay/initiate
  → Tạo PaymentTransaction (PENDING)
  → Trả về paymentUrl
  → Client redirect đến VNPay
  → VNPay gọi callback POST /payments/vnpay/callback
  → Cập nhật status COMPLETED/FAILED
```

**Lưu ý quan trọng:** Hiện tại `paymentUrl` chỉ là URL giả (`localhost:8080/...`). Chưa tích hợp thật với VNPay SDK — khi đưa lên production cần gọi VNPay API thật để lấy URL redirect.

### Bank Transfer (chuyển khoản thủ công)
```
Client → POST /payments/bank-transfer/initiate
  → Tạo PaymentTransaction (PENDING)
  → Trả về thông tin tài khoản ngân hàng + nội dung chuyển khoản
  → Khách tự chuyển khoản
  → Admin xác nhận: PATCH /payments/{id}/confirm
  → Cập nhật status COMPLETED
```

Thông tin ngân hàng (tên bank, số TK, tên TK) đọc từ `application.properties` qua `@Value`.

### Bảo vệ chống xử lý 2 lần
Cả 2 luồng đều kiểm tra `status != "PENDING"` trước khi xử lý → nếu callback/confirm gọi 2 lần thì lần 2 bị lỗi `PAYMENT_ALREADY_PROCESSED`.

### Liên kết với Order
Mỗi khi payment hoàn thành → cập nhật `order.paymentStatus` tương ứng:
- `COMPLETED` (transaction) → `PAID` (order)
- `FAILED` (transaction) → `FAILED` (order)

---

## 11. DataInitializer — Tài khoản admin mặc định

Chạy **1 lần khi app khởi động** (implements `ApplicationRunner`).

Nếu chưa có user `admin@gmail.com` → tự tạo với:
- Password: `123` (đã BCrypt)
- Role: `ADMIN`
- `isVerified = true`, `isActive = true`

Dùng để test ngay mà không cần đăng ký. **Nhớ đổi mật khẩu trước khi deploy production.**

---

## 12. Vấn đề cần chú ý

### File trùng lặp (cần dọn dẹp)
Có các cặp file tên na ná nhau, nội dung tương tự:

| File 1 | File 2 | Nên giữ |
|---|---|---|
| `VNPayPaymentRequest.java` | `VnpayPaymentRequest.java` | `VnpayPaymentRequest` (đang được dùng trong service) |
| `VNPayInitiateResponse.java` | `VnpayInitiateResponse.java` | `VnpayInitiateResponse` (đang được dùng trong service) |
| `AuthProvider.java` | `AuthProviderType.java` | `AuthProviderType` (đang được dùng) |
| `Role.java` | `RoleType.java` | `RoleType` (đang được dùng) |

### GOOGLE_VERIFY trong OTP
`PurposeType` có giá trị `GOOGLE_VERIFY` nhưng không thấy dùng trong code, chức năng đăng nhập Google chưa implement.

### VNPay chưa tích hợp thật
`PaymentService.initiateVnpay()` trả về URL giả. Cần tích hợp VNPay SDK thật (chữ ký HMAC-SHA512, các tham số `vnp_*`) trước khi đưa lên production.

### Shipping fee luôn = 0
Trong `OrderService.placeOrder()`, `shippingFee = BigDecimal.ZERO`. Chưa có logic tính phí ship.

### CORS chỉ cho `localhost:5173`
`SecurityConfig.corsConfigurationSource()` hardcode origin `http://localhost:5173`. Khi deploy production phải cập nhật theo domain thật.
