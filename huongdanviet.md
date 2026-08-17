# Hướng Dẫn Tìm Hiểu Tầng Service Trong Dự Án (LVTN)

Tầng Service (Service Layer) đóng vai trò trung tâm trong cả Backend và Frontend của dự án:
- **Backend (Spring Boot - Java):** Chứa toàn bộ nghiệp vụ lõi (Business Logic). Tầng này nhận dữ liệu từ Controller, xử lý các quy tắc nghiệp vụ, tính toán, và gọi đến tầng Repository để thao tác với cơ sở dữ liệu.
- **Frontend (JavaScript):** Đóng gói các lời gọi API (thường dùng qua thư viện như Axios trong `apiClient.js`). Việc tách riêng service giúp UI component (React/Vue) không phải chứa các URL hay logic gọi mạng, dễ dàng tái sử dụng.

Dưới đây là danh sách chi tiết tất cả các file service, chức năng của chúng và các hàm quan trọng bên trong.

---

## 1. BACKEND SERVICES (Java)
*Vị trí: `TAWatch/TAWatch/src/main/java/TAWactch/example/TAWatch/*/service/`*

Các service này được đánh dấu bằng `@Service` và thường có interface/class gọi xuống DB. Dưới đây là phân nhóm theo chức năng:

### 1.1 Nhóm Sản Phẩm (Product & Review)
Quản lý mọi thứ liên quan đến hiển thị, biến thể, hình ảnh và đánh giá sản phẩm.
- **`WatchService.java`**: Service quan trọng nhất quản lý đồng hồ.
  - *Hàm chính:* `getAllWatches`, `getWatchesPaged` (phân trang), `getWatchById`, `createWatch`, `updateWatch`, `deleteWatch`, `searchPublic` (tìm kiếm), `toggleFeatured` (đánh dấu nổi bật).
- **`BrandService.java`**, **`CategoryService.java`**, **`SegmentService.java`**, **`ColorService.java`**: Quản lý các thuộc tính của đồng hồ (Thương hiệu, Danh mục, Phân khúc, Màu sắc).
  - *Hàm chính:* `getAll...`, `getById`, `create...`, `update...`, `delete...`
- **`WatchVariantService.java`**: Quản lý các biến thể của đồng hồ (ví dụ: cùng một mẫu nhưng khác chất liệu dây).
  - *Hàm chính:* `getAllByWatchId`, `create`, `update`, `delete`.
- **`WatchVariantImageService.java`**: Quản lý hình ảnh cho các biến thể.
  - *Hàm chính:* `uploadAndCreate` (tải ảnh lên Cloudinary và lưu DB), `setPrimary` (đặt ảnh chính), `batchCreate`.
- **`ReviewService.java`**: Quản lý đánh giá của người dùng.
  - *Hàm chính:* `create`, `approve` (duyệt đánh giá), `getByWatch`, `getByUser`.

### 1.2 Nhóm Đơn Hàng & Giỏ Hàng (Order, Cart, Payment & Shipping)
Xử lý quy trình mua hàng cốt lõi.
- **`CartService.java`**: Quản lý giỏ hàng của user (hoặc session cho khách vãng lai).
  - *Hàm chính:* `getOrCreateCartBySession`, `getOrCreateCartForUser`, `addItem`, `updateItem`, `removeItem`, `mergeCart` (gộp giỏ khi user đăng nhập).
- **`OrderService.java`**: Logic trung tâm cho việc đặt hàng.
  - *Hàm chính:* `placeOrder` (đặt hàng, trừ tồn kho), `updateOrderStatus`, `cancelOrder`, `assignShipper`, `returnOrder`.
- **`PaymentService.java`**: Xử lý thanh toán điện tử.
  - *Hàm chính:* `initiateVnpay` (tạo URL VNPay), `handleVnpayCallback` (nhận phản hồi IPN), `initiateBankTransfer`.
- **`GhnService.java`**: Tích hợp API Giao Hàng Nhanh (GHN).
  - *Hàm chính:* `getProvinces`, `getDistricts`, `getWards` (lấy địa chỉ), `calculateFee` (tính phí ship), `createShippingOrder` (tạo đơn trên hệ thống GHN).
- **`ShipperService.java`**: Quản lý shipper nội bộ của cửa hàng.
  - *Hàm chính:* `create`, `getActive`, `update`.
- **`GhnAutoUpdateService.java` & `OrderAutoCleanService.java`**: Các tác vụ chạy ngầm (Cron Job/Scheduler).
  - *Hàm chính:* `autoUpdateOrderStatusFromGHN` (tự động đồng bộ trạng thái đơn hàng), `autoClean` (tự huỷ đơn chưa thanh toán sau N giờ).

### 1.3 Nhóm Người Dùng & Xác Thực (User & Auth)
- **`AuthService.java`**: Đăng nhập và đăng ký.
  - *Hàm chính:* `login`, `register`, `loginWithGoogle` (OAuth2), `resetPassword`.
- **`UserService.java`**: Quản lý tài khoản (Admin dùng).
  - *Hàm chính:* `getAllUsers`, `getUser`, `updateRole`, `voHieuHoa` (khóa tài khoản).
- **`UserAddressService.java`**: Sổ địa chỉ của người mua.
  - *Hàm chính:* `createAddress`, `setDefault` (đặt làm mặc định).
- **`OtpService.java` & `EmailService.java`**: Gửi mã OTP qua email để xác thực.
  - *Hàm chính:* `sendOtp`, `verifyOtp`, `sendOtpEmail`.
- **`CustomUserDetailsService.java`**: Tích hợp với Spring Security (hàm `loadUserByUsername`).

### 1.4 Nhóm Khuyến Mãi (Promotion)
- **`PromotionService.java`**: Quản lý các chương trình sale tự động giảm giá.
- **`CouponService.java`**: Quản lý mã giảm giá (Voucher).
  - *Hàm chính:* `validateAndCalculate` (kiểm tra mã và tính tiền giảm), `markAsUsed`.

### 1.5 Nhóm Kho Hàng (Inventory)
- **`SupplierService.java`**: Quản lý nhà cung cấp.
- **`ImportReceiptService.java`**: Quản lý phiếu nhập kho.
  - *Hàm chính:* `create`, `confirm` (xác nhận nhập kho - cộng số lượng tồn), `cancel`.

### 1.6 Nhóm Hệ Thống (System)
- **`AdminLogService.java`**: Ghi nhận lịch sử thao tác của Admin.
- **`StoreSettingsService.java`**: Cấu hình chung cho website (logo, phí ship mặc định, v.v.).
- **`CloudinaryService.java`**: Tương tác API upload ảnh lên Cloudinary.


---

## 2. FRONTEND SERVICES (JavaScript)
*Vị trí: `TAWATCHFE/tawatch/src/services/`*

Các file này tương ứng 1-1 với backend. Chúng sử dụng **`apiClient.js`** để thực hiện HTTP Requests (GET, POST, PUT, DELETE).

### 2.1 File Cấu Hình Lõi
- **`apiClient.js`**: File rất quan trọng. Nó cấu hình Axios cơ bản: thiết lập Base URL, tự động gắn Token (JWT) vào Header, chặn và xử lý lỗi chung (Interceptor).
- **`cache.js`**: Dùng để lưu trữ bộ nhớ tạm (ví dụ cache danh mục để không gọi lại API nhiều lần).

### 2.2 Các Object Services
Hầu hết các file service trên frontend export ra một object (ví dụ `export const watchService = { ... }`). Nội dung bên trong là các async functions gọi API:

- **`authService.js`**: Chứa `login(data)`, `register(data)`, `verifyOtp()`, `loginGoogle()`.
- **`userService.js`**: Chứa `getProfile()`, `updateProfile()`, và đóng gói `addressService` (`getAddresses()`, `addAddress()`).
- **`watchService.js`**, **`productService.js`**: Chứa `getWatches()`, `getWatchById(id)`, `searchWatches(keyword)`.
- **`orderService.js`**: Chứa `createOrder(payload)`, `getMyOrders()`, `cancelOrder(id)`.
- **`cartService.js`**: Chứa `getCart()`, `addToCart(productId, qty)`, `removeFromCart(id)`.
- **`paymentService.js`**: Chứa `createVnpayUrl(amount)`, `checkPaymentStatus()`.
- **`ghnService.js`**: Gọi API lấy tỉnh/huyện/xã (`getProvinces()`, `getDistricts(provinceId)`).
- **Các service còn lại** (`loyaltyService`, `wishlistService`, `reviewService`, `couponService`, `importReceiptService`, `supplierService`, `brandService`, `categoryService`...): Chủ yếu là các tác vụ CRUD cơ bản gởi đến Backend để Admin quản lý hoặc User tương tác.

---

## 3. Tóm Lại Để Hiểu & Viết Code

Khi thầy giáo yêu cầu làm một chức năng mới (Ví dụ: Thêm tính năng **Sản phẩm yêu thích - Wishlist**), bạn thao tác theo trình tự:

1. **Ở Backend (Java):**
   - Viết `WishlistEntity.java` và `WishlistRepository.java`.
   - Tạo `WishlistService.java`: Viết các hàm logic (như `add(userId, watchId)`, `remove(...)`, `getWishlist(userId)`). Trong các hàm này bạn sẽ gọi Repository để lưu/xoá vào DB.
   - Tạo `WishlistController.java`: Mở các API Endpoint (ví dụ `@PostMapping("/add")`) và gọi xuống `WishlistService`.
2. **Ở Frontend (JS):**
   - Tạo `wishlistService.js` trong thư mục `services`.
   - Viết hàm gọi API: `add: async (id) => { return await apiClient.post('/wishlist/add', { watchId: id }) }`.
   - Vào Component/Trang web (Vue/React): Thêm nút "Yêu thích", khi click vào nút đó thì gọi hàm của `wishlistService.add()`.

## 4. Phân Tích Chuyên Sâu Các Hàm Cốt Lõi (Backend)

Để hiểu rõ cách viết code, chúng ta sẽ "mổ xẻ" 3 hàm quan trọng nhất trong Backend. Khi code tính năng tương tự, bạn cần tuân theo logic này:

### 4.1. Hàm Đặt Hàng `OrderService.placeOrder(OrderRequest request)`
Đây là hàm phức tạp nhất vì nó cập nhật nhiều bảng cùng lúc (Order, OrderItem, WatchVariant, Coupon). Quy trình thực thi tuần tự như sau:
1. **Kiểm tra User:** Nếu khách hàng đã đăng nhập (có userId), tìm kiếm trong DB xem tài khoản có hợp lệ và đã xác thực email chưa.
2. **Kiểm tra Tồn kho (Stock):** Vòng lặp duyệt qua từng sản phẩm khách mua. Lấy ra `WatchVariant` (biến thể) từ DB, kiểm tra xem nó có đang hoạt động không (`isActive`) và **số lượng tồn kho (`stockQuantity`) có đủ không**. Nếu thiếu sẽ ném ra lỗi.
3. **Tính toán giá tiền (Subtotal):** Cộng dồn tổng tiền: `price * quantity`.
4. **Xử lý Mã giảm giá (Coupon):** Nếu khách nhập mã, gọi `couponService.validateAndCalculate()` để xem mã có hết hạn không, đơn hàng có đủ điều kiện áp dụng không, và tính ra số tiền được giảm (`discountAmount`).
5. **Lưu Đơn Hàng (Order):** Tính tổng tiền cuối cùng (`totalAmount = subtotal + shippingFee - discountAmount`). Tạo mới đối tượng `Order`, set trạng thái ban đầu là `PENDING` và `UNPAID` rồi lưu bằng `orderRepo.save()`.
6. **Lưu Chi tiết đơn (OrderItem) & Trừ tồn kho:** Lưu từng mặt hàng vào bảng `order_item` (kèm theo snapshot thông tin sản phẩm lúc mua). Đặc biệt quan trọng: **trừ đi số lượng tồn kho** trong bảng `watch_variant` (`variant.setStockQuantity(variant.getStockQuantity() - số_lượng_mua)`).
7. **Cập nhật Coupon & Lịch sử:** Đánh dấu mã giảm giá đã dùng thêm 1 lần và ghi lại lịch sử tạo đơn.

**💡 Chú ý quan trọng cho bạn:** 
Hàm này bắt buộc phải có annotation `@Transactional` của Spring. Điều này đảm bảo tính "toàn vẹn dữ liệu". Giả sử lưu Order thành công (bước 5), nhưng lúc lưu OrderItem (bước 6) CSDL bị lỗi, `@Transactional` sẽ tự động hủy (rollback) luôn cái Order vừa tạo, tránh tình trạng có đơn hàng nhưng không có sản phẩm bên trong.

### 4.2. Hàm Đăng Nhập `AuthService.login(LoginRequest request)`
Quy trình xác thực an toàn chuẩn RESTful API:
1. **Tìm kiếm User:** Hệ thống cho phép đăng nhập bằng cả Email hoặc Username. Nếu không tìm thấy, lập tức báo lỗi.
2. **Kiểm tra Trạng thái:** Xem tài khoản có bị khóa bởi Admin không (`isActive == false`).
3. **Kiểm tra Mật khẩu (Bảo mật cao):** Hệ thống KHÔNG lưu mật khẩu dạng chữ thường mà băm (hash) bằng **BCrypt**. Do đó, phải dùng hàm `passwordEncoder.matches(mật_khẩu_nhập_vào, mật_khẩu_đã_băm_trong_DB)` để kiểm tra. Tuyệt đối không dùng dấu `==`.
4. **Tạo JWT Token:** Nếu đúng mật khẩu, gọi `jwtUtil.generateToken()` để tạo một chuỗi mã hóa (Token). Gửi chuỗi này về cho Frontend (Kèm theo prefix "Bearer"). Frontend sẽ cất Token này vào localStorage và gắn vào Header mỗi khi muốn gọi các API yêu cầu đăng nhập.

### 4.3. Quản Lý Tồn Kho Khi Nhập Hàng `ImportReceiptService.confirm(...)`
Khi Admin tạo Phiếu nhập kho (Import Receipt), quá trình xử lý:
1. Tìm kiếm và lấy thông tin phiếu nhập từ `ImportReceiptRepo`. Kiểm tra xem phiếu này đã xác nhận chưa.
2. Duyệt qua danh sách sản phẩm nhập (`ImportReceiptDetail`).
3. Lấy `WatchVariant` (Biến thể đồng hồ) tương ứng, **cộng thêm** số lượng nhập vào `stockQuantity`. Đồng thời tính toán lại giá vốn (`costPrice`) theo trung bình gia quyền (hoặc cập nhật giá vốn mới nhất).
4. Đổi trạng thái phiếu nhập thành `CONFIRMED` và lưu lại lịch sử Admin (`AdminLogService`).

**💡 Tư duy chung khi Code:** 
Khi thầy giáo yêu cầu viết hàm mới trong Service, bạn luôn nhớ trình tự: 
`(1) Lấy dữ liệu đầu vào -> (2) Validate dữ liệu hợp lệ không -> (3) Xử lý logic / tính toán -> (4) Update trạng thái các Object liên quan -> (5) Gọi Repository lưu xuống CSDL -> (6) Trả về Response.`
