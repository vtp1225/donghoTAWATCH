# BÁO CÁO REVIEW DỰ ÁN TAWATCH (LVTN)

- **Frontend**: `TAWATCHFE/tawatch` — ReactJS/Vite
- **Backend**: `TAWatch/TAWatch` — Java Spring Boot

---

# PHẦN 1 — LỖI LOGIC NGHIỆP VỤ

## A. Lỗi logic tính toán sai

### A1. Race condition oversell khi đặt hàng — **Cao**
`OrderService.java:62-176` `placeOrder()`

- **Vấn đề**: Hàm đọc `variant.getStockQuantity()` (dòng 88), so sánh với quantity, rồi mới trừ kho ở dòng 165. Không có `@Lock(PESSIMISTIC_WRITE)` hay `@Version` trên `WatchVariant`. Hai request đặt cùng 1 biến thể cuối cùng (còn 1 sản phẩm) sẽ cùng pass check `stockQuantity < quantity`, cùng trừ kho → tồn kho âm, bán quá số lượng thực.
- **Mức độ**: Cao — lỗi kinh điển, rất hay bị hỏi trong bảo vệ.
- **Cách sửa**:
  - Thêm `@Version` field vào `WatchVariant` để JPA optimistic lock tự ném `OptimisticLockException` khi 2 transaction cùng ghi. Hoặc
  - Trong `WatchVariantRepo` thêm `@Lock(LockModeType.PESSIMISTIC_WRITE)` cho `findById`, hoặc viết query `UPDATE WatchVariant SET stockQuantity = stockQuantity - :qty WHERE id = :id AND stockQuantity >= :qty` rồi check `affectedRows`.

### A2. Race condition khi dùng coupon — **Cao**
`OrderService.java:104-113` kết hợp `CouponService.markAsUsed` (dòng 152-162) và `validateAndCalculate` (dòng 122-150)

- **Vấn đề**: Coupon code áp dụng cho toàn user (general code, `coupon.getUser() == null`). Hai user cùng nhập code trong 2 request song song: cùng pass `validateAndCalculate` (check `isUsed=false`), cùng `markAsUsed`. Đoạn `markAsUsed` có nhánh `if (coupon.getUser() != null)` → **code chung không bao giờ bị set `isUsed=true`**, chỉ tăng `usedCount`. Khi `maxUses` bị vượt do 2 request concurrent cùng check `usedCount >= maxUses` rồi cùng tăng.
- **Mức độ**: Cao — coupon có thể bị lạm dụng quá giới hạn `maxUses`.
- **Cách sửa**:
  - Dùng `@Version` trên `Promotion` để optimistic lock `usedCount`.
  - Hoặc query update atomic: `UPDATE Promotion SET usedCount = usedCount + 1 WHERE id = :id AND usedCount < maxUses`, check affectedRows.
  - Cân nhắc set `isUsed=true` cho cả coupon chung (cần refactor schema: tách `CouponUsage` riêng).

### A3. Race condition thăng hạng loyal khi 2 đơn cùng DELIVERED — **Trung bình**
`OrderService.java:257-269`

- **Vấn đề**: Khi admin đổi 2 đơn của cùng user sang DELIVERED cùng lúc, `loyaltyPoints` được read-modify-write: `oldPoints + 1`. Nếu 2 thread cùng đọc `oldPoints`, cùng ghi `+1`, mất 1 đơn (hoặc cấp coupon 2 lần). Mức độ thấp hơn A1 vì ít xảy ra với cùng 1 user.
- **Cách sửa**: Query atomic `UPDATE User SET loyaltyPoints = loyaltyPoints + 1 WHERE id = :id`, rồi re-read để kiểm tra tier.

### A4. `markAsUsed` không set isUsed cho coupon chung — **Cao** (logic nghiệp vụ)
`CouponService.java:152-162`

- **Vấn đề**: Như đã nêu trong A2, chỉ `coupon.getUser() != null` mới bị mark used. Với coupon chung áp dụng cho tất cả user, một user có thể nhập lại cùng code cho nhiều đơn (check `existsByUserIdAndCouponId` ở `OrderService.java:108` không khớp vì coupon chưa từng được gán cho user). Lỗ hổng bảo mật/chính sách — user lạm dụng coupon nhiều lần.
- **Cách sửa**: Cần tách rõ "coupon 1 lần mỗi user" (lưu `CouponUsage` với userId+couponId) vs "coupon công khai giới hạn tổng lượt dùng". Logic hiện tại nằm giữa hai mô hình.

### A5. `placeOrder` — coupon bị `markAsUsed` cả khi thanh toán COD chưa hoàn tất — **Trung bình**
`OrderService.java:170-172`

- **Vấn đề**: `markAsUsed(coupon)` chạy ngay khi tạo đơn PENDING. Nếu user hủy đơn (sau đó `cancelOrder` dòng 214-242 không có logic hoàn coupon), coupon đó bị "tiêu" mãi mãi — user mất coupon dù không mua thành công.
- **Cách sửa**:
  - Chỉ mark coupon dùng khi `paymentStatus = PAID`, OR
  - Thêm logic rollback coupon trong `cancelOrder` (reset `isUsed=false`, giảm `usedCount`).

### A6. `cancelOrder` không rollback payment — **Trung bình**
`OrderService.java:214-242`

- **Vấn đề**: Đơn đã thanh toán VNPay (PAID) rồi user hủy → tồn kho được hoàn (dòng 230-234) nhưng `paymentStatus` vẫn PAID, không có logic refund. Tạo mâu thuẫn dữ liệu: đơn CANCELLED + payment PAID.
- **Cách sửa**: Trong `cancelOrder`, nếu `paymentStatus == PAID` → set sang `REFUNDED` hoặc `PENDING_REFUND`, và trong `validateStatusTransition` chỉ cho phép cancel đơn chưa thanh toán (chặn PAID), hoặc tạo flow hoàn tiền riêng.

### A7. `confirmBankTransfer` không kiểm chứng `transactionCode` thực sự khớp — **Trung bình**
`PaymentService.java:218-245`

- **Vấn đề**: Admin nhận `transactionCode` từ client, chỉ lưu vào `responseData` mà không verify với sao kê ngân hàng. Mọi endpoint đều có thể bị admin giả mạo. Tuy nhiên đây là chấp nhận trong mô hình admin trust, mức độ Trung bình.
- **Cách sửa**: Nếu muốn chặt hơn, tích hợp API ngân hàng để verify.

### A8. `confirmBankTransfer` không set `orderStatus` sang CONFIRMED — **Thấp**
`PaymentService.java:239-242`

- **Vấn đề**: Chỉ set `paymentStatus = PAID` mà không đổi `orderStatus` từ PENDING → CONFIRMED (như `handleVnpayCallback` dòng 168-170 có làm). Bank transfer confirmed nhưng đơn vẫn kẹt ở PENDING, admin phải vào update status thủ công.
- **Cách sửa**: Thêm dòng set `orderStatus = CONFIRMED` khi `previousStatus == PENDING`.

### A9. Tính `salePrice` dựa trên `minPrice` biến thể rẻ nhất, không phải biến thể mặc định — **Trung bình**
`WatchService.java:268-303`

- **Vấn đề**: Badge giảm giá hiển thị cho biến thể rẻ nhất, nhưng nút "Thêm vào giỏ" dùng `defaultVariantId`. Khi user bấm thêm, item thêm vào có giá khác giá sale trên card.
- **Cách sửa**: Tính `salePrice` dựa trên giá của `defaultVariantId`, không phải `minPrice`.

## B. Thiếu validate dữ liệu đầu vào

### B1. `placeOrder` không validate `quantity > 0`, `paymentMethod != null`, `deliveryMethod != null` — **Cao**
`OrderService.java:62-176`

- **Vấn đề**: Chỉ check `items.isEmpty()` (dòng 63). Nếu client gửi `quantity = 0` hoặc âm, `lineTotal` sai, tồn kho không bị trừ nhưng vẫn tạo order. `paymentMethod` null được lưu thẳng vào DB. `deliveryMethod` null tương tự.
- **Cách sửa**: Validate từng item: `quantity > 0`, check `request.paymentMethod()` != null, `request.deliveryMethod()` != null ngay đầu hàm.

### B2. `placeOrder` cho khách (guest) không validate bắt buộc `guestName`, `guestEmail`, `guestPhone` — **Cao**
`OrderService.java:69-75` và `buildShippingSnapshot` dòng 475-496

- **Vấn đề**: Nếu `request.userId() == null` (guest), không có check `guestName/guestEmail/guestPhone` có null/blank không. Đơn guest có thể được tạo với toàn null → không thể liên hệ khách.
- **Cách sửa**: Nếu `userId == null`, validate `guestName`, `guestEmail`, `guestPhone` không blank, email đúng format.

### B3. `placeOrder` không validate `shippingFee` từ client có thể bị inject — **Cao** (bảo mật)
`OrderService.java:117-120`

- **Vấn đề**: `shippingFee` lấy trực tiếp từ `request.shippingFee()` do client gửi. User tự sửa payload gửi `shippingFee = 0` → miễn phí ship không xin phép. Đây cũng là lỗi bảo mật, sẽ trình bày ở Phần 2.
- **Cách sửa**: Server tự tính shipping fee dựa trên `deliveryMethod`, địa chỉ, trọng lượng (đã có GHN service). Không tin `shippingFee` từ client.

### B4. `OrderService.updateOrderStatus` không kiểm tra `request.newStatus() != null` — **Trung bình**
`OrderService.java:248-292`

- **Vấn đề**: Nếu `newStatus` null, `validateStatusTransition` ném exception hơi khó hiểu. Validate rõ ràng hơn sẽ tốt.
- **Cách sửa**: Thêm null check đầu hàm.

### B5. `ReviewService.create` không validate `rating` 1-5 — **Trung bình**
`ReviewService.java:84-129`

- **Vấn đề**: Có `ErrorCode.RATING_INVALID` (10006) defined nhưng service không check. Client gửi `rating = 99` vẫn được lưu.
- **Cách sửa**: `if (request.rating() == null || request.rating() < 1 || request.rating() > 5) throw new AppException(ErrorCode.RATING_INVALID);`

### B6. `ImportReceiptService.create` không validate `unitCost >= 0`, `quantity > 0` — **Trung bình**
`ImportReceiptService.java:73-86`

- **Vấn đề**: `lineCost = unitCost × quantity`. Nếu âm → total âm. Tồn kho cộng/trừ sai.
- **Cách sửa**: Validate từng item: `quantity > 0`, `unitCost >= 0`.

### B7. `PromotionService.create` check date range bị lặp và NPE risk — **Trung bình**
`PromotionService.java:49-68`

- **Vấn đề**: Dòng 53-57 check `if (startDate != null && endDate != null)` rồi mới so sánh, nhưng dòng 58 `if (request.startDate().isAfter(request.endDate()))` không check null — sẽ NPE nếu 1 trong 2 null. Logic redundant và mâu thuẫn.
- **Cách sửa**: Đầu hàm validate `startDate != null && endDate != null`, nếu thiếu throw exception; sau đó chỉ cần 1 check `endDate.isBefore(startDate)`.

### B8. `validateAndCalculate` chia không làm tròn, có thể ra chuỗi thập phân dài — **Thấp**
`CouponService.java:142`

- **Vấn đề**: `subtotal.multiply(promo.getDiscountValue()).divide(BigDecimal.valueOf(100))` không set scale/rounding mode → `ArithmeticException` nếu kết quả là số thập phân vô hạn (vd 1/3). WatchService.java:292 đã dùng `RoundingMode.HALF_UP` đúng — CouponService chưa.
- **Cách sửa**: `.divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP)`.

## C. Thiếu `@Transactional`

### C1. `OrderService.getOrdersByUser` và `getAllOrders` không `@Transactional` nhưng lazy load quan hệ — **Trung bình**
`OrderService.java:190-209`

- **Vấn đề**: `toOrderResponse` gọi `item.getWatchVariant().getWatch().getName()` (dòng 513), `item.getWatchVariant().getDialColor()` — các quan hệ lazy. Nếu session Hibernate đã đóng, ném `LazyInitializationException`. Dù có thể đang chạy được nhờ `OpenInViewInterceptor`, nhưng không an toàn.
- **Cách sửa**: Thêm `@Transactional(readOnly = true)` cho 2 hàm đọc này, hoặc dùng `@EntityGraph` / fetch join.

### C2. `CouponService.validate`, `getFeatured`, `getMyCoupons`, `getAll` không `@Transactional` — **Trung bình**
`CouponService.java:42-181`

- **Vấn đề**: Truy cập `coupon.getPromotion().getIsActive()` (dòng 58, 130) lazy load. Tương tự C1.
- **Cách sửa**: `@Transactional(readOnly = true)` cho các hàm đọc.

### C3. `ReviewService.getAll`, `getByWatch`, `getByUser`, `enrichWithImages` không `@Transactional` — **Trung bình**
- **Vấn đề**: Tương tự C1, C2 — lazy load `review.getWatch()`, `review.getUser()`.
- **Cách sửa**: `@Transactional(readOnly = true)`.

### C4. `UserService.getAllUsers`, `getUser`, `getLoyaltyInfo` không `@Transactional` — **Thấp**
- **Vấn đề**: `userMappers.toRespone(user)` truy cập quan hệ, có thể lazy fail.
- **Cách sửa**: `@Transactional(readOnly = true)`.

### C5. Dùng `jakarta.transaction.Transactional` (JTA) thay vì Spring `@Transactional` — **Thấp**
`PaymentService.java:121`, `OrderService.java:32,61,214,247,297,312,553`, `CartService.java`, `ImportReceiptService.java`

- **Vấn đề**: `jakarta.transaction.Transactional` là annotation JTA (dùng cho Java EE / app server), còn Spring recommend dùng `@Transactional` của Spring (`org.springframework.transaction.annotation`) để tận dụng các tính năng roll-back theo exception, propagation, isolation. Tuy nhiên Spring vẫn tương thích ngược với JTA nên code vẫn chạy.
- **Cách sửa**: Đổi sang `org.springframework.transaction.annotation.Transactional` để nhất quán với Spring idioms. Ưu tiên thấp.

## D. Logic lặp (DRY)

### D1. Logic tìm ảnh đại diện bị lặp 4 nơi — **Trung bình** (bảo trì)
- `OrderService.buildProductSnapshot` dòng 466-469
- `OrderService.toOrderResponse` dòng 505-509
- `CartService.buildCartResponse` dòng 266-269
- `ReviewService.enrichWithImages` dòng 151-174 (đã gom batch, tốt)

Cùng pattern: "nếu `variant.getImageUrl()` null/blank thì fallback `findFirstByVariant_Watch_IdAndIsMainImageTrue`". Nên gom thành method dùng chung, hoặc best: set `imageUrl` vào `WatchVariant` ngay khi query (fetch join) để không phải fallback.

### D2. Logic tính discount PERCENT bị lặp giữa `CouponService.validateAndCalculate` và `PromotionService.validateProfitMargin` và `WatchService` (đoạn tính `salePrice`) — **Trung bình**
- Cùng công thức: `price × discountValue / 100`, cap bởi `maxDiscountAmount`.
- Nên gom thành method tĩnh trong 1 utility, ví dụ `DiscountCalculator.applyPercent(price, discountValue, maxDiscountAmount)`.

### D3. Pattern `findById(...).orElseThrow(() -> new AppException(ErrorCode.X_NOT_FOUND))` lặp khắp nơi — **Thấp** (cosmetic)
- Có thể gom thành `requireById(repo, id, errorCode)` generic. Tuy nhiên pattern này cũng rõ ràng, ưu tiên thấp.

### D4. Khởi tạo `Cart` mới cho user lặp 2 nơi — **Trung bình**
- `AuthService.register` dòng 69-73
- `AuthService.loginWithGoogle` dòng 128-132
- `UserService.createUser` dòng 57-61

Cùng logic. Nên gom thành `CartService.createForUser(user)`.

### D5. Snapshot JSON build thủ công bằng `String.format` — **Cao** (bug tiềm ẩn)
`OrderService.buildShippingSnapshot` dòng 480-496

- **Vấn đề**: Dùng `String.format` với `\"` escape để build JSON thủ công. Nếu `recipientName`, `phone`, `addressDetail` chứa dấu `"` hoặc `\` → JSON bị vỡ, sau đó `objectMapper.readTree(snapshot)` (dòng 338) ném exception → GHN create fail. Cũng là vector JSON injection.
- **Cách sửa**: Dùng `ObjectMapper.writeValueAsString(map)` để serialize an toàn.

---

# PHẦN 2 — BẢO MẬT

## A. Phân quyền (Authorization) thiếu / sai

### A1. IDOR — `GET /orders/{orderId}` công khai, không kiểm tra user — **Cao**
`SecurityConfig.java:169` + `OrderController.java:38-45` + `OrderService.getOrderById` (dòng 181-185)

- **Vấn đề**: Endpoint `GET /orders/{orderId}` được `permitAll()` (SecurityConfig dòng 169). Bất kỳ ai cũng có thể duyệt `orderId` từ 1, 2, 3... và xem chi tiết đơn hàng của người khác (tên, SĐT, địa chỉ, email — `OrderResponse` chứa `guestName`, `guestEmail`, `guestPhone`, `shippingAddressSnapshot`). Đây là lộ thông tin cá nhân (PII) nghiêm trọng.
- **Mức độ**: Cao — vi phạm GDPR/chính sách bảo mật dữ liệu khách hàng. Hội đồng sẽ hỏi.
- **Cách sửa**: Đổi sang `authenticated()`. Trong `OrderService.getOrderById`, kiểm tra: nếu user đăng nhập (lấy từ `request attribute "userId"`) và `order.getUser() != null` thì phải `order.getUser().getId().equals(currentUserId)`. Admin/Staff cho phép. Guest thì phải khớp SĐT hoặc dùng token ngẫu nhiên (orderId-uuid) thay vì số nguyên tăng dần.

### A2. IDOR — `GET /orders/my/{userId}` không kiểm tra `userId` khớp user đang đăng nhập — **Cao**
`SecurityConfig.java:168` + `OrderController.java:51-58` + `OrderService.getOrdersByUser` (dòng 190-197)

- **Vấn đề**: `authenticated()` chỉ yêu cầu đăng nhập, nhưng `userId` lấy từ path. User A đăng nhập, gửi `GET /orders/my/5` → xem toàn bộ đơn của user 5. Không có check "userId trong path phải bằng userId của token".
- **Cách sửa**: Trong controller, lấy `request.getAttribute("userId")` (do JwtAuthenticationFilter set ở dòng 52) và so sánh với path variable. Hoặc bỏ path variable, luôn dùng userId từ token (`@RequestAttribute("userId") Integer userId`).

### A3. IDOR — `GET /users/{userId}/addresses/**` không kiểm tra userId khớp user đăng nhập — **Cao**
`SecurityConfig.java:146` + `UserAddressController.java`

- **Vấn đề**: `authenticated()` nhưng không check user trong path. User A xem/sửa/xóa địa chỉ của user B bằng cách đổi `userId` trong URL. Service `getAddress(userId, id)` đã check `findByUserIdAndId` — nhưng `getAddressesByUser(userId)` (dòng 21) chỉ lọc theo userId path, không check token.
- **Cách sửa**: So sánh path userId với `request.getAttribute("userId")`. Admin cho phép.

### A4. IDOR — Wishlist, Cart, Loyalty cùng pattern — **Cao**
`WishlistController` (`/wishlist/user/{userId}/**`), `CartController` (`/cart/user/{userId}`), `UserController.getLoyaltyInfo` (`/users/{id}/loyalty`)

- Tất cả đều dùng path variable `userId` mà không check khớp token. Cart đặc biệt nguy hiểm vì `POST /cart/{cartId}/items` ai cũng thêm được vào cart bất kỳ khi biết cartId (SecurityConfig dòng 162 `permitAll()` cho POST /cart/**). User A thêm hàng vào cart của user B.
- **Cách sửa**: 
  - Cart phải check: nếu cart có `user != null` thì phải khớp `request.getAttribute("userId")`. 
  - Wishlist/Loyalty: bỏ path variable, dùng `@RequestAttribute("userId")`.

### A5. `POST /orders/{orderId}/return` — client gửi `userId` trong body, không từ token — **Cao**
`OrderController.java:142-151` + `OrderService.returnOrder` (dòng 553-576)

- **Vấn đề**: `OrderReturnRequest` chứa `userId`, client tự gửi. Bất kỳ ai cũng có thể gọi `POST /orders/123/return` với `userId=999` để giả danh user khác yêu cầu đổi trả. Service check `order.getUser().getId().equals(userId)` nhưng `userId` đến từ body, không phải token.
- **Cách sửa**: Bỏ field `userId` khỏi request, dùng `@RequestAttribute("userId")`. Yêu cầu đăng nhập.

### A6. `POST /orders` (`placeOrder`) permitAll — user có thể mạo danh người khác — **Cao**
`SecurityConfig.java:167` + `OrderService.placeOrder` (dòng 69-75)

- **Vấn đề**: `OrderRequest.userId` do client gửi. Nếu user A đăng nhập, gọi `POST /orders` với `userId = 5` → đơn hàng được tạo cho user 5. Không check token. Đơn COD có thể bị mạo danh để giao hàng đến nhà người khác (đánh bom hoặc quấy rối).
- **Cách sửa**: Lấy userId từ `request.getAttribute("userId")` (token). Nếu token tồn tại, dùng nó. Nếu không token → guest flow (validate guest info bắt buộc).

### A7. `POST /cart/merge?userId=` permitAll — ai cũng có thể merge vào cart user khác — **Cao**
`SecurityConfig.java:162` + `CartController.java:105-114`

- **Vấn đề**: `POST /cart/**` permitAll, `merge` lấy userId từ query param. User A merge cart guest của mình vào user B → hàng đợi trong cart của user B, gây rối.
- **Cách sửa**: Check userId từ token, yêu cầu authenticated.

### A8. `SecurityConfig.java:146` comment "khai báo TRƯỚC /users/**" — rule ordering có vấn đề — **Trung bình**
`SecurityConfig.java:145-155`

- **Vấn đề**: Comment cho thấy dev ý thức vấn đề ordering của Spring Security matchers (first match wins). Tuy nhiên các rule `/users/*/addresses/**`, `/users/*/loyalty` đang để `authenticated()` — nghĩa là ADMIN cũng match rule này trước và không bị hạn chế. OK cho admin. Nhưng nếu có rule như `GET /users/**` `hasAnyRole(ADMIN, STAFF)` phía sau, thì STAFF có thể xem mọi user (đúng ý). Không phải lỗi, chỉ là fragile.
- **Cách sửa**: Đề nghị dùng `@PreAuthorize` ở method controller thay vì dựa vào thứ tự URL matchers — dễ bảo trì hơn.

### A9. `SecurityConfig.java:104-106` — `/payments/vnpay/**` quá rộng — **Trung bình**
- **Vấn đề**: Match `permitAll()` cho `/payments/vnpay/**` — bao gồm cả endpoint không nên public. Chỉ `/vnpay/callback` và `/vnpay/initiate` cần public (đã có rule riêng ở dòng 178-179). Rule dòng 104-106 dư và có thể mở endpoint khác nếu sau này thêm endpoint `/payments/vnpay/...`.
- **Cách sửa**: Xóa rule dòng 104-106, giữ lại 3 rule cụ thể đã có.

### A10. Thiếu `@PreAuthorize` ở method-level — **Thấp** (cosmetic/architectural)
- **Vấn đề**: Toàn bộ authorization nằm trong `SecurityConfig` dựa vào URL + HTTP method. Khi nghiệp vụ phức tạp (vd: user chỉ được sửa review của chính mình, staff được duyệt nhưng chỉ được xóa review do chính mình duyệt...) thì URL rules không đủ. Hiện tại review approve/delete không check ai đã tạo.
- **Cách sửa**: Thêm `@PreAuthorize` ở method controller cho rule phức tạp.

## B. JWT xử lý

### B1. Không có blacklist/revocation khi logout, đổi password, hoặc disable user — **Cao**
`JwtUtil.java`, `JwtAuthenticationFilter.java`

- **Vấn đề**: Token sau khi phát hành có hiệu lực đến khi hết hạn (`jwt.expiration`). Không có endpoint logout, không có cơ chế revoke. Khi user đổi password (`AuthService.resetPassword` dòng 96-106), token cũ vẫn dùng được. Khi admin disable user (`UserService.voHieuHoa`), token vẫn valid → user bị disable vẫn truy cập được cho đến khi token hết hạn.
- **Cách sửa**: 
  - Triển khai blacklist token trong Redis (set với TTL = thời gian còn lại của token), check trong `JwtAuthenticationFilter`.
  - Hoặc dùng refresh token + access token ngắn hạn (15 phút), refresh kiểm tra user còn active không.

### B2. `JwtAuthenticationFilter` không check user còn active/quên đăng nhập — **Cao**
`JwtAuthenticationFilter.java:44-53` + `CustomUserDetailsService.java:21-33`

- **Vấn đề**: Filter chỉ check `isTokenValid` (chữ ký + hết hạn + không phải reset token). Sau đó `loadUserByUsername` tìm user — nhưng `UserDetails` trả về không set `enabled` dựa trên `user.getIsActive()`. Spring Security sẽ không chặn user bị disable. Người dùng bị `voHieuHoa` vẫn dùng token hiện có.
- **Cách sửa**: Trong `CustomUserDetailsService`, build `User` Spring Security với `enabled = user.getIsActive()`, `accountNonLocked = user.getIsActive()`. Thêm filter Spring `DisabledException` handler.

### B3. `JwtUtil.generateToken` không có `issuer`, `audience`, `notBefore` — **Thấp**
`JwtUtil.java:34-48`

- **Vấn đề**: Thiếu các claim chuẩn (iss, aud, nbf) — tốt cho validate chặt hơn nhưng không bắt buộc cho mô hình đơn giản.
- **Cách sửa**: Thêm `iss`, `aud` để filter check.

### B4. Reset password token — chỉ check type "RESET_PASSWORD", không check token đã được dùng chưa — **Cao**
`AuthService.resetPassword` (dòng 96-106) + `JwtUtil.isResetToken` (dòng 67-76)

- **Vấn đề**: Reset token sau khi dùng 1 lần vẫn valid đến khi hết hạn (15 phút). User có thể dùng lại nhiều lần. Không có blacklist cho reset token đã dùng.
- **Cách sửa**: Lưu `jti` (JWT ID) của reset token đã dùng vào DB/Redis, check khi reset password.

### B5. `JwtAuthenticationFilter` ném `AppException` khi token sai — không đúng ngữ cảnh — **Thấp**
`JwtUtil.extractEmail` (dòng 78-84) ném `AppException(INVALID_TOKEN)`, được gọi từ filter dòng 47. Tuy nhiên filter catch rồi bỏ qua (nằm trong if). Đợi xem: thực ra filter gọi `extractEmail` chỉ khi `isTokenValid` đã true, nên gần như không ném. Nhưng nếu token bị tamper sau khi verify chữ ký nhưng trước khi parse claim (hiếm), sẽ ném `AppException` → bị bắt bởi `handleException(Exception)` → 400. Filter nên catch mọi exception và để request đi tiếp như unauthenticated.
- **Cách sửa**: Wrap `extractEmail` và `loadUserByUsername` trong try-catch, log warning, để filter chain tiếp tục.

## C. Lộ thông tin nhạy cảm

### C1. `UserResponse` loại bỏ passwordHash — tốt — **Đã làm đúng**
`UserResponse.java:15-16` — comment "passwordHash excluded intentionally". Đúng.

### C2. `PaymentService.handleVnpayCallback` log ra secret prefix và mọi params — **Cao**
`PaymentService.java:129-143`

- **Vấn đề**: `System.out.println("--- Secret prefix (6 chars) ---")` và in ra secret 6 ký tự đầu. In vào stdout (log file prod). Ai có quyền đọc log lấy được 6 ký tự secret đầu — bước đầu để brute force secret. Cũng in toàn bộ params VNPay. Đây là debug code production.
- **Cách sửa**: Xóa khối debug (dòng 129-143) hoặc chuyển sang `logger.debug` với level DEBUG, không in secret.

### C3. `OrderResponse` trả về `unitCost` (giá vốn) — **Cao**
`OrderService.toOrderResponse` (dòng 502-523), `OrderItemResponse` có field `unitCost`

- **Vấn đề**: `OrderItemResponse` chứa `unitCost` (giá vốn sản phẩm) — trả về cho cả user thường qua `GET /orders/{orderId}`. Lộ margin lợi nhuận. Đây là thông tin nội bộ.
- **Cách sửa**: Tạo 2 DTO riêng: `OrderItemResponse` (cho user, không có `unitCost`) và `OrderItemAdminResponse` (cho admin, có `unitCost`). Map khác nhau tùy role.

### C4. `shippingAddressSnapshot` trả về raw JSON string — **Trung bình**
`OrderResponse.shippingAddressSnapshot` (dòng 532)

- **Vấn đề**: Trả về nguyên chuỗi JSON (chứa SĐT, tên, địa chỉ nhà) cho bất kỳ ai gọi `GET /orders/{orderId}` (đang permitAll — xem A1). Lộ thông tin cá nhân khách hàng.
- **Cách sửa**: Fix A1 trước (hạn chế truy cập). Có thể mask bớt SĐT cho user thường.

### C5. `PaymentTransactionResponse` trả về `responseData` nguyên vẹn — **Trung bình**
`PaymentService.toResponse` (dòng 274-287)

- **Vấn đề**: `responseData` chứa toàn bộ params VNPay callback (bao gồm cả thông tin nội bộ gateway, có thể có số thẻ/token). Trả về cho client.
- **Cách sửa**: Filter `responseData` trước khi trả về client, chỉ để các field an toàn.

### C6. `UserService.getAllUsers` trả về email, SĐT, ngày sinh của mọi user cho STAFF — **Trung bình**
`UserController.getAllUsers` (dòng 23-30) + `UserResponse`

- **Vấn đề**: STAFF được xem toàn bộ thông tin cá nhân khách hàng. Có thể chấp nhận nhưng cần cân nhắc chính sách quyền riêng tư.
- **Cách sửa**: Nếu STAFF chỉ cần quản lý đơn thì không cần trả email/phone/SĐT. Có thể tách DTO `UserAdminResponse` vs `UserStaffResponse`.

## D. SQL Injection / IDOR / các lỗi khác

### D1. `OrderService.buildShippingSnapshot` build JSON thủ công — **Cao** (JSON injection)
`OrderService.java:480-496` — đã trình bày ở Phần 1 (D5). Nếu `recipientName` chứa `","evil":1`, JSON bị vỡ/hijack.

### D2. Không phát hiện SQL injection qua repository — **Thấp** (đã an toàn)
- Tất cả repo dùng derived query hoặc `@Query` JPQL — an toàn khỏi SQL injection. Chỉ có vấn đề nếu có `@Query(nativeQuery=true)` với string concat. Tôi đã grep và không thấy. OK.

### D3. `OrderService` không validate `quantity` (B1) — liên quan bảo mật — **Trung bình**
- User có thể gửi `quantity = -5` → `lineTotal` âm → `totalAmount` âm → VNPay initiate với amount âm → lỗi gateway. Hoặc gửi `quantity = 0` → đơn rỗng vẫn tạo. Đã nói Phần 1.

### D4. CSRF disabled — **Thấp**
`SecurityConfig.java:76` `csrf.disable()`

- **Vấn đề**: Với API stateless + JWT, CSRF disable là chuẩn (JWT không gửi qua cookie nếu frontend dùng `Authorization: Bearer`). Cần check frontend thực sự dùng header, không gửi token trong cookie.
- **Cách sửa**: Verify frontend `TAWATCHFE/tawatch/src/services/api.js` (hoặc tương tự) gửi JWT qua `Authorization` header, không phải cookie.

### D5. CORS cho phép `http://localhost:8080/` với dấu `/` cuối — **Thấp** (bug cosmetic)
`SecurityConfig.java:47`

- **Vấn đề**: `"http://localhost:8080/"` — Spring CORS strict string match, dấu `/` cuối có thể không match các request từ origin `http://localhost:8080` (không slash). Có thể chặn sai.
- **Cách sửa**: Bỏ dấu `/` cuối hoặc dùng `setAllowedOriginPatterns`.

### D6. `GlobalExceptionHandler.handleException(Exception)` trả 400 cho mọi lỗi — **Trung bình**
`GlobalExceptionHandler.java:12-18`

- **Vấn đề**: Mọi exception chưa được catch (vd `NullPointerException`, `DataAccessException`...) đều trả 400 Bad Request với message là `ex.getClass().getSimpleName() + ": " + ex.getMessage()`. Lộ stack trace / class name nội bộ cho client. Lỗi server thật (vd DB down) cũng trả 400 thay vì 500.
- **Cách sửa**: 
  - Log stack trace server-side (dùng `logger.error`).
  - Trả về message chung chung (`"Lỗi hệ thống, vui lòng thử lại"`) với HTTP status 500.
  - Không dump `ex.getClass().getSimpleName()` ra response.

### D7. `paymentController.vnpayCallback` chấp nhận `Map<String, String>` không validate — **Trung bình**
`PaymentController.java:45-52`

- **Vấn đề**: Endpoint công khai nhận payload tùy ý. Trong service có verify chữ ký, nhưng nếu thiếu field sẽ ném `NullPointerException` ở `params.get("vnp_TxnRef")` → rơi vào `handleException(Exception)` → 400 + lộ message. Có thể bị spam.
- **Cách sửa**: Validate required fields trước (vnp_TxnRef, vnp_ResponseCode, vnp_SecureHash) → trả `PAYMENT_INVALID_SIGNATURE` rõ ràng. Rate limit IP.

### D8. `OtpController` và `AuthController.register` không rate limit — **Cao**
`AuthController.login`, `AuthController.register`, `AuthController.resetPassword`, `OtpController`

- **Vấn đề**: Không có rate limit. Brute force password, spam OTP gửi email (gửi nhiều request `/otp/send` → tốn email quota, có thể bị email provider block).
- **Cách sửa**: Dùng Bucket4j hoặc Spring Cloud Gateway rate limit. Đặc biệt OTP send phải giới hạn 1 phút/lần (đã có check trong OTP service) và IP-level.

### D9. Google login tin tưởng `accessToken` từ client — **Trung bình**
`AuthService.loginWithGoogle` (dòng 108-143) + `AuthController.loginWithGoogle`

- **Vấn đề**: Client gửi `accessToken` (Google OAuth), server gọi Google để lấy userinfo. Nếu client gửi token đã hết hạn hoặc giả mạo → service ném `GOOGLE_TOKEN_INVALID`. OK về mặt logic. Nhưng: nếu user đã có email trong hệ thống với `authProvider=LOCAL`, attacker tạo Google account cùng email → gọi `/auth/google` → `findByEmail(info.email())` match user LOCAL → attacker truy cập tài khoản người khác. Xem dòng 111-112: `findByGoogleId(...).orElseGet(() -> findByEmail(...))`. Nếu email trùng, attacker đăng nhập được.
- **Cách sửa**: Nếu `user.getAuthProvider() == LOCAL` (hoặc `user.getGoogleId() == null`), không cho login Google — yêu cầu user link Google account qua flow riêng (verify email sở hữu). Logic dòng 133-138 link googleId vào user hiện có — đây là lỗ hổng.

### D10. `VnpayInitiateResponse` chứa `paymentUrl` với `vnp_SecureHash` — OK, nhưng `confirmBankTransfer` không verify chữ ký bank statement — đã nói A7 phần 1.

---

# PHẦN 3 — HIỆU NĂNG (Performance)

## A. N+1 query

### A1. `OrderService.getOrdersByUser` — N+1 cho mỗi order — **Cao**
`OrderService.java:190-197`

- **Vấn đề**: Vòng lặp `orders.stream().map(o -> toOrderResponse(o, orderItemRepo.findByOrderId(o.getId())))` (dòng 195). Với N đơn hàng, tạo N+1 query: 1 cho `findByUserIdOrderByCreatedAtDesc` + N query `findByOrderId`. Nếu user có 50 đơn → 51 query. Tồi tệ hơn khi `toOrderResponse` còn gọi `watchVariantImageRepo.findFirstByVariant_Watch_IdAndIsMainImageTrue(v.getWatch().getId())` (dòng 507) cho **mỗi item** — thêm N×M query nữa (M = số item trung bình mỗi đơn).
- **Mức độ**: Cao — endpoint `GET /orders/my/{userId}` sẽ chậm khi user nhiều đơn. Hội đồng có thể hỏi về endpoint này.
- **Cách sửa**: Viết query batch trong `OrderItemRepo`: `List<OrderItem> findByOrderIdInOrderById(Collection<Integer> orderIds)`. Gom tất cả items 1 query, group trong memory. Tương tự cho ảnh: dùng `findMainImagesByWatchIds` đã có sẵn.

### A2. `OrderService.getAllOrders` — tương tự A1 nhưng cho admin — **Cao**
`OrderService.java:202-209`

- Cùng pattern N+1 như A1. Admin xem toàn bộ đơn — dễ có hàng nghìn đơn, N+1 × M = hàng nghìn query.
- **Cách sửa**: Như A1. Ngoài ra cần phân trang (xem B1).

### A3. `OrderService.toOrderResponse` — fallback ảnh individual query — **Trung bình**
`OrderService.java:505-509`

- **Vấn đề**: Mỗi item trong đơn đều có nhánh "nếu variant.imageUrl null → query `findFirstByVariant_Watch_IdAndIsMainImageTrue`". Khi build list nhiều đơn, mỗi item là 1 query DB. Đã có `findMainImagesByWatchIds` batch (CartService dùng ở dòng 253) — OrderService không dùng. Lặp lại (trùng Phần 1 D1).
- **Cách sửa**: Batch fetch main images ngay đầu `toOrderResponse` (gom watchIds từ items), map trong memory. Không fallback per-item.

### A4. `ReviewService.getByUser` không enrichWithImages — **Thấp** (nhất quán)
`ReviewService.java:71-78`

- **Vấn đề**: 2 nhánh `getAll`, `getByWatch` dùng `enrichWithImages` (batch ảnh), nhưng `getByUser` lại không — trả response thiếu field imageUrl. Không phải lỗi hiệu năng, mà là inconsistency. Nếu sửa cho enrich, sẽ cần batch ảnh.
- **Cách sửa**: `getByUser` cũng nên gọi `enrichWithImages`.

### A5. `CouponService.getAll` và `getFeatured` dùng `couponRepo.findAll()` rồi filter trong memory — **Cao**
`CouponService.java:42-48` và `50-64`

- **Vấn đề**: Load toàn bộ coupon từ DB vào memory rồi filter. Khi có 10.000 coupon đã từng tạo, query load hết + stream filter → chậm và tốn RAM. Đặc biệt `getFeatured` dùng làm public API, gọi mỗi lần load trang home.
- **Cách sửa**: Thêm method repo với WHERE clause: `findByIsUsedFalseAndUserIsNull()`, `findActiveFeatured(Instant now)` với query SQL trực tiếp. Dùng `@EntityGraph` để fetch `promotion` eager trong cùng query.

### A6. `PromotionService.getAll` dùng `promotionRepo.findAll()` — **Trung bình**
`PromotionService.java:38-43`

- Tương tự A5. Tải toàn bộ promotion để filter `isActive`. Khi data lớn sẽ chậm.
- **Cách sửa**: `findByIsActive` đã có trong repo (dòng 14). Đang dùng đúng cho `isActive != null`. Còn nhánh `isActive == null` load all — chấp nhận cho admin khi số lượng promotion ít.

### A7. `OrderService.placeOrder` — query WatchVariant theo vòng lặp — **Trung bình**
`OrderService.java:82-92`

- **Vấn đề**: Vòng lặp `for (OrderItemRequest itemReq : request.items())` gọi `watchVariantRepo.findById` cho từng item. Nếu giỏ có 10 sản phẩm khác variant → 10 query. Có thể gom batch.
- **Cách sửa**: Dùng `watchVariantRepo.findAllById(itemIds)` 1 query, map vào Map<id, variant>. Tuy nhiên số item trong đơn thường ít (<10), mức độ ưu tiên thấp hơn.

### A8. `OrderService.cancelOrder` & `updateOrderStatus` — gọi `findByOrderId` nhiều lần — **Thấp**
`OrderService.java:230` (cancel), `277` và `290` (updateStatus)

- **Vấn đề**: Trong `cancelOrder`, `findByOrderId` được gọi 2 lần (dòng 230 để hoàn kho, dòng 240 để build response). Trong `updateOrderStatus` cũng vậy (dòng 277 cho refund, dòng 290 cho response).
- **Cách sửa**: Gọi 1 lần, gán vào biến `items`, dùng cho cả 2 mục đích.

### A9. `WatchVariantRepo` không có query batch cho `findActiveByWatchIds` — đã có JOIN FETCH — **Đã làm đúng**
- `findActiveByWatchIds` (dòng 15-16) dùng `JOIN FETCH v.watch` — tránh N+1 cho `variant.getWatch()`. Tốt. Tương tự `findAllByWatchIds`. Repo này đã đúng pattern.

### A10. `PaymentService.handleVnpayCallback` — `System.out.println` nhiều — **Trung bình** (đã nói Phần 2 C2)
- Trùng Phần 2 C2. Mỗi callback in ra ~15 dòng stdout. Nếu prod có nhiều transaction, log phình. Không phải lỗi query nhưng ảnh năng I/O.

## B. Thiếu phân trang

### B1. `OrderService.getAllOrders` trả `List<OrderResponse>` không phân trang — **Cao**
`OrderService.java:202-209` + `OrderController.getAllOrders`

- **Vấn đề**: Admin gọi `GET /orders?status=PENDING` → load toàn bộ đơn PENDING. Khi có 10.000 đơn PENDING, query + map + serialize JSON → OOM hoặc rất chậm. Không có Page.
- **Cách sửa**: Đổi `Page<OrderResponse> getAllOrders(OrderStatusType status, Pageable pageable)`. Controller nhận `page`, `size` query param. Frontend đã có pagination pattern cho watches.

### B2. `UserService.getAllUsers` trả `List<UserResponse>` không phân trang — **Trung bình**
`UserService.java:67-71` + `UserController.getAllUsers`

- Tương tự B1. Admin xem toàn bộ user. Khi data lớn → chậm.
- **Cách sửa**: Phân trang.

### B3. `CouponService.getAll` không phân trang — **Trung bình**
- Trùng A5, đã nói. Cần phân trang + filter DB-side.

### B4. `ReviewService.getAll` không phân trang — **Trung bình**
- Admin duyệt review, nếu có 5.000 review pending → load hết.
- **Cách sửa**: Phân trang.

### B5. `PromotionService.getAll` không phân trang — **Thấp**
- Số promotion thường ít (<100), không nghiêm trọng, nhưng nên nhất quán.

### B6. `WatchController.getFeaturedWatches` và `getNewestWatches` có `limit` — **Đã làm đúng**
- `getNewestWatches(@RequestParam(defaultValue = "8") int limit)` — có giới hạn. OK.
- Tuy nhiên `getFeaturedWatches` (controller dòng 147-154) không có limit. `watchRepo.findByIsFeaturedTrueAndIsActiveTrue()` (WatchRepo dòng 24) trả List tất cả featured. Nên thêm limit.

### B7. `WishlistService.getWishlist` có thể trả list lớn — **Thấp**
- User thường wishlist ít (<50), không nghiêm trọng.

## C. Tính toán thừa / gọi DB dư thừa

### C1. `OrderService.placeOrder` lưu order 1 lần + save từng OrderItem trong loop — **Trung bình**
`OrderService.java:147, 163-167`

- **Vấn đề**: `orderRepo.save(order)` trước, rồi `orderItemRepo.save(item)` cho từng item. Có thể batch save `saveAll(items)` 1 query. Với 10 items → 10 query thay vì 1.
- **Cách sửa**: Thu thập items vào `List<OrderItem>`, gọi `orderItemRepo.saveAll(items)` 1 lần.

### C2. `OrderService.cancelOrder` — save từng variant trong loop — **Trung bình**
`OrderService.java:230-234`

- Tương tự C1. Dùng `saveAll(variants)`.
- Áp dụng tương tự cho `updateOrderStatus` (dòng 277-281).

### C3. `OrderService.placeOrder` lưu `coupon` qua `markAsUsed` — 2 query save — **Thấp**
- `couponRepo.save(coupon)` + `promotionRepo.save(promo)` — chấp nhận, 2 entity khác nhau.

### C4. `ImportReceiptService.confirm` — save từng variant trong loop — **Trung bình**
`ImportReceiptService.java:103-122`

- **Vấn đề**: Mỗi item cập nhật stock + costPrice cho variant, save từng cái. Với 20 item → 20 save.
- **Cách sửa**: `variantRepo.saveAll(variantsToUpdate)`.

### C5. `ImportReceiptService.create` — save từng item trong loop — **Trung bình**
`ImportReceiptService.java:73-86`

- Tương tự C1. Dùng `saveAll`.

### C6. `CartService.addItem` — lưu `existingItem` rồi lưu `cart` 2 lần — **Thấp**
`CartService.java:91, 106-107`

- `cartItemRepo.save(existingItem)` rồi `cartRepo.save(cart)`. Cart chỉ cần 1 save. Cosmetic.

### C7. `WatchService.enrichWatches` — duyệt `activePromos` 2 lần — **Thấp**
`WatchService.java:255-262`

- **Vấn đề**: `activePromos.stream().filter(appliesToAll).findFirst()` rồi `activePromos.stream().filter(watch-specific).forEach()`. Nếu có nhiều promotion, duyệt 2 lần.
- **Cách sửa**: 1 loop duy nhất, check cả 2 điều kiện. Tuy nhiên số promotion active thường ít, không đáng kể.

### C8. `WatchService.enrichWatches` — `promoByWatch.put(wid, p)` lặp `watchIds.forEach` cho appliesToAll — **Thấp**
`WatchService.java:257-258`

- Nếu `watchIds` có 1000 id, put 1000 lần cho mỗi appliesToAll promo. OK nhưng nếu nhiều promo appliesToAll thì dư. Ưu tiên thấp.

### C9. `OrderService.generateOrderCode` dùng `System.currentTimeMillis()` + substring — **Thấp** (không phải hiệu năng, mà là tính đúng đắn)
`OrderService.java:444-450`

- **Vấn đề**: `String.valueOf(System.currentTimeMillis()).substring(7)` — lấy 6 ký tự cuối của epoch millis. Có thể trùng nhau nếu 2 đơn tạo trong cùng 1 ms (race). Mức độ thấp nhưng không unique.
- **Cách sửa**: Dùng UUID hoặc sequence number từ DB. (Đã có `generateCode` trong ImportReceiptService dùng random + check exists — tốt hơn.)

### C10. `OrderService.placeOrder` — `existsByUserIdAndCouponId` chạy query check đã dùng coupon — **Thấp**
`OrderService.java:108`

- Query này có index? Kiểm tra `@Indexed` trên `coupon_id` + `user_id` trong bảng `orders`. Nếu không có index, query full scan. Ưu tiên thấp vì user thường ít đơn.

### C11. `OrderService.createGhnOrder` — query `orderItemRepo.findByOrderId` 2 lần tiềm năng — **Thấp**
- Trong `updateOrderStatus` (dòng 290) gọi `findByOrderId` để build response, rồi `createGhnOrder` (dòng 349) lại gọi `findByOrderId` thêm 1 lần nữa. Tổng 2 query + build response.
- **Cách sửa**: Truyền `items` vào `createGhnOrder` thay vì query lại.

## D. Vấn đề hiệu năng khác

### D1. `WatchVariant` không cache main image — đã được lưu vào `imageUrl` field? — Cần kiểm tra
- Có field `imageUrl` trên `WatchVariant` (dùng ở `OrderService.buildProductSnapshot` dòng 465). Nếu field này lưu URL ảnh chính → các service fallback (A3) sẽ không cần. Có vẻ dữ liệu đã có sẵn nhưng logic fallback vẫn chạy. Nên dọn lại.

### D2. LazyInitializationException risk (trùng Phần 1 C1-C4) — khi fix transaction, sẽ có overhead nhỏ. Nhưng an toàn hơn.

### D3. Không có cache layer — **Thấp**
- `getFeatured`, `getNewest`, `getWatchesPaged` là API công khai gọi mỗi lần load trang home. Có thể cache kết quả 1-5 phút với Spring Cache (`@Cacheable`). Tuy nhiên cho LVTN, không bắt buộc.

### D4. `WatchService.searchPublic` — query EXISTS subquery cho minPrice/maxPrice — **Trung bình**
`WatchRepo.java:59-64`

- **Vấn đề**: Subquery `EXISTS (SELECT v FROM WatchVariant v WHERE v.watch = w AND v.price >= :minPrice)` cho mỗi watch match. Có thể chậm nếu dataset lớn.
- **Cách sửa**: Có thể chuyển sang JOIN với WatchVariant, group by Watch.id. Tuy nhiên subquery EXISTS thường OK với index đúng.

### D5. `PromotionService.validateProfitMargin` — load toàn bộ WatchVariant để check — **Cao**
`PromotionService.java:96-127`

- **Vấn đề**: Khi promotion `appliesToAll = true`, dòng 101 gọi `watchVariantRepo.findAll()` — load toàn bộ biến thể trong hệ thống. Nếu có 5.000 biến thể → tải hết vào memory. Chạy mỗi lần tạo/sửa promotion.
- **Cách sửa**: Viết query SQL tính trực tiếp: `SELECT 1 FROM watch_variant v WHERE v.price - <discount> < v.cost_price LIMIT 1`. Nếu trả về 1 row → có variant bị lỗ → ném exception. Không cần load tất cả.

---

# PHẦN 4 — CODE CONVENTION & KHẢ NĂNG BẢO TRÌ

## A. Đặt tên sai / không nhất quán

### A1. `UserMappers` (có `s`) — trong khi các mapper khác là `UserMapper` — **Thấp** (inconsistency)
`user/mapper/UserMappers.java`

- **Vấn đề**: Tất cả mapper khác đều `UserMapper`, `WatchMapper`, `CouponMapper`, `ReviewMapper` (singular). Duy nhất `UserMappers` có `s` — không nhất quán, dễ gây lỗi khi code review / import.
- **Cách sửa**: Đổi tên class `UserMappers` → `UserMapper`, cập nhật tất cả references (dùng IDE refactor).

### A2. `TAWactch` (gõ nhầm) trong package root — **Thấp** (đã ăn sâu, refactor cost cao)
`TAWatch/TAWatch/src/main/java/TAWactch/...`

- **Vấn đề**: Package gốc là `TAWactch.example.TAWatch` — "TAWactch" có vẻ typo của "TAWatch". Tuy nhiên đã ăn sâu vào toàn bộ code, refactor sẽ cần thay đổi package declaration + import của hàng trăm file, có thể gây lỗi.
- **Cách sửa**: Có thể để nguyên, chỉ cần thêm comment ở README hoặc CLAUDE.md giải thích. Hoặc nếu còn thời gian, dùng IDE refactor toàn bộ.

### A3. Package `DB` viết hoa — **Thấp**
`TAWatch/TAWatch/src/main/java/TAWactch/example/TAWatch/DB/`

- **Vấn đề**: Java convention là lowercase package. `DB` viết hoa — vi phạm convention, không theo chuẩn Java Coding Convention.
- **Cách sửa**: Đổi thành `db` hoặc di chuyển ra khỏi `src/main/java` (vì đó là file SQL/migration, không phải code Java). Nên đặt ở `src/main/resources/db/` hoặc root project.

### A4. Lỗi chính tả trong ErrorCode enum — **Trung bình**
`common/enums/ErrorCode.java:5,7,8,9`

- **Vấn đề**:
  - `EMAIl_NOT_FOUND` (dòng 5) — viết hoa chữ `I` cuối thay vì `EMAIL_NOT_FOUND`
  - `UNCATEGORIED_EXCEPTION` (dòng 7) — thiếu chữ `Z` (đúng: `UNCATEGORIZED`)
  - `PASSWORD_VALID` (dòng 8) — message là "phải có ít nhất 6 ký tự" (tức là lỗi khi INVALID), nhưng tên là `PASSWORD_VALID` — gây hiểu lầm
  - `EMAIL_VALID` (dòng 9) — tương tự, tên sai nghĩa (dùng cho lỗi "Email không đúng định dạng")
- **Cách sửa**:
  - `EMAIL_NOT_FOUND`, `UNCATEGORIZED_EXCEPTION`
  - `PASSWORD_INVALID` (hoặc `PASSWORD_TOO_SHORT`), `EMAIL_INVALID`
- **Lưu ý**: `PASSWORD_VALID`, `EMAIL_VALID` đang được dùng làm `@Email(message = "PASSWORD_VALID")` — cần update cả `RegisterRequest`, `ResetPasswordRequest`, `UserRequest`, `UserResponse`.

### A5. Method tiếng Việt `voHieuHoa` — **Thấp** (inconsistency với toàn bộ codebase dùng tiếng Anh)
`UserService.java:97`

- **Vấn đề**: Toàn bộ codebase dùng tiếng Anh (`disableUser`, `enableUser`, `getLoyaltyInfo`), chỉ có `voHieuHoa` là tiếng Việt không dấu. Gây khó đọc, khó tìm.
- **Cách sửa**: Đổi thành `disableUser(int id)`. `enableUser` đã đúng.

### A6. `getIsActive()`, `getIsVerified()`, `getIsFeatured()`, `getIsUsed()`, `getIsApproved()` — **Thấp** (Lombok + Boolean wrapper)
- **Vấn đề**: Dùng `Boolean` (wrapper) thay vì `boolean` (primitive) cho các field `isActive`, `isVerified`... khiến Lombok sinh getter là `getIsActive()` thay vì `isActive()`. Dẫn đến cách gọi khó chịu `!Boolean.TRUE.equals(user.getIsActive())` hoặc `if (!user.getIsActive())`.
- **Cách sửa**: Nếu muốn getter là `isActive()`, dùng `boolean` primitive. Hoặc giữ nguyên nhưng thống nhất style check (dùng `Boolean.TRUE.equals()` để tránh NPE).

## B. Lỗi chính tả / typo rải rác

### B1. `apiRespone` (thiếu `s`) trong `GlobalExceptionHandler` — **Thấp**
`GlobalExceptionHandler.java:14, 22, 37`

- **Vấn đề**: Biến `apiRespone` thay vì `apiResponse` — lỗi typo nhỏ nhưng lặp 3 lần.
- **Cách sửa**: Rename thành `apiResponse`.

### B2. `toRespone` (thiếu `s`) trong `UserMappers` — **Thấp**
`UserMappers.java` (đã nói A1)

- **Vấn đề**: Method `toRespone` thay vì `toResponse`. Dùng ở `AuthService`, `UserService`, `OrderService.toOrderResponse` (dòng 528).
- **Cách sửa**: Rename method.

### B3. Comment tiếng Việt không dấu — **Thấp**
`OrderService.java:174` `"Don hang moi duoc tao"`, `AuthService.java` các dòng comment rải rác

- **Vấn đề**: Nhiều comment/note tiếng Việt không dấu lẫn tiếng Anh. Không nhất quán ngôn ngữ.
- **Cách sửa**: Chọn 1 ngôn ngữ cho codebase (tiếng Anh khuyến nghị cho LVTN nếu hướng hội đồng).

## C. Dead code / code chết

### C1. `System.out.println` debug block trong `PaymentService.handleVnpayCallback` — **Cao**
`PaymentService.java:129-143` (đã nói Phần 2 C2)

- **Vấn đề**: Block debug 15 dòng in ra stdout, bao gồm cả secret prefix. Dead code (production không cần), cần xóa.
- **Cách sửa**: Xóa toàn bộ block, hoặc chuyển sang `logger.debug` + kiểm soát level.

### C2. `System.out.println` rải rác — **Trung bình**
- `PaymentService.java` (15 dòng) — đã nói C1
- `GhnAutoUpdateService.java:25,45` — "[GHN] Bắt đầu quét..." log info qua System.out
- `EmailService.java:25,40` — log fallback OTP qua System.err
- `CloudinaryService.java:33` — log lỗi qua System.err
- **Cách sửa**: Dùng SLF4J/Logback (`@Slf4j` của Lombok hoặc `private static final Logger log = LoggerFactory.getLogger(...)`) để kiểm soát log level, format, và output file.

### C3. File SQL trong `src/main/java/.../DB/` — **Trung bình**
`TAWatch/.../DB/DB.sql`, `DB_DOCUMENTATION.md`, `migrate_vnpay.sql`

- **Vấn đề**: File `.sql` và `.md` để trong package Java — sai vị trí. Maven/Gradle có thể không copy vào output (tùy config). Không phải source code, nên để ở `src/main/resources/db/` hoặc `docs/` ở root project.
- **Cách sửa**: Di chuyển sang `src/main/resources/db/` hoặc `docs/db/`.

### C4. `@LogAdminActivity` annotation tồn tại nhưng chưa có aspect xử lý? — **Thấp**
`common/annotation/LogAdminActivity.java` (đã bị xóa trong git status)

- **Vấn đề**: Annotation `@LogAdminActivity` xuất hiện ở `OrderController`, `WatchController`, nhưng file annotation đã bị xóa (xem git status ở đầu conversation — "D TAWatch/.../annotation/LogAdminActivity.java"). Có thể compile fail.
- **Cách sửa**: Khôi phục file hoặc xóa hết usage của annotation.

## D. Exception handling không nhất quán

### D1. `GlobalExceptionHandler` trả 400 cho mọi lỗi — **Trung bình** (đã nói Phần 2 D6)
`GlobalExceptionHandler.java:12-18`

- **Vấn đề**: `handleException(Exception)` trả 400 + dump class name. Cần 500 cho server errors, log server-side.
- **Cách sửa**: Tách `handleException(Exception)` thành 500 với message chung.

### D2. `ErrorCode` dùng code `9999` cho UNCATEGORIED và `99991` cho INVALID_KEY — **Thấp**
`ErrorCode.java:7,10`

- **Vấn đề**: Mã `99991` không nhất quán với pattern (các code khác là 4 chữ số theo module).
- **Cách sửa**: Đổi `INVALID_KEY` thành `1010` hoặc tương tự theo pattern.

### D3. Mã `1008` trùng — `EMAIL_NOT_VERIFIED` và `USER_ALREADY_VERIFIED` — **Trung bình**
`ErrorCode.java:44-45`

- **Vấn đề**: Cả hai dùng code `1008` — lỗi logic, frontend nhận response code 1008 không biết là trường hợp nào.
- **Cách sửa**: `EMAIL_NOT_VERIFIED = 1008`, `USER_ALREADY_VERIFIED = 1011`.

### D4. `GlobalExceptionHandler.handleMethodArgumentNotValidException` không log detail — **Thấp**
- **Vấn đề**: Khi validation fail, chỉ trả về message. Không log detail server-side để debug.
- **Cách sửa**: `log.warn("Validation error: {}", ex.getBindingResult().getAllErrors())`.

### D5. `AppException` cho tất cả lỗi nghiệp vụ — đã tốt, nhưng có chỗ throw `Exception` — **Trung bình**
- Nhiều chỗ dùng `throw new AppException(ErrorCode.X)` — nhất quán. 
- Nhưng `JwtUtil.generateToken` ném `AppException(UNCATEGORIED_EXCEPTION)` (dòng 46, 63) khi `JOSEException` — mất thông tin lỗi gốc.
- **Cách sửa**: Log exception gốc, ném AppException với ErrorCode cụ thể hơn (vd `TOKEN_GENERATION_FAILED`).

### D6. Không có `@ExceptionHandler` cho `DataIntegrityViolationException`, `ConstraintViolationException` — **Trung bình**
- **Vấn đề**: Khi DB constraint vi phạm (vd unique constraint), ném `DataIntegrityViolationException` → rơi vào `handleException(Exception)` → 400 + dump class name. Không rõ cho client.
- **Cách sửa**: Thêm handler riêng, map sang `ErrorCode` cụ thể (vd duplicate key → `USER_EXISTS`, `WATCH_SKU_EXISTS`).

## E. Cấu trúc code

### E1. Package `common` chứa quá nhiều thứ — **Thấp**
`common/` có 8 subpackage: annotation, aspect, config, dto, enums, exception, security, util

- **Vấn đề**: Khá lớn. Nhưng tổ chức hợp lý theo chức năng. OK cho LVTN.

### E2. Không có file `Mapper.java` cho `Cart`, `Order`, `Payment`, `ImportReceipt`, `Supplier`, `Shipper`, `AdminLog`, `Otp` — **Trung bình** (inconsistency)
- **Vấn đề**: Một số module có Mapper riêng (`UserMapper`, `WatchMapper`, `CouponMapper`...), một số khác build response thủ công trong service (`CartService.buildCartResponse`, `OrderService.toOrderResponse`, `PaymentService.toResponse`, `ImportReceiptService.toResponse`, `ShipperService`, `AdminLogService`). Không nhất quán.
- **Cách sửa**: Tạo mapper riêng cho mỗi module, dùng MapStruct hoặc viết tay. Nhất quán pattern.

### E3. `CartService` và `OrderService` chứa logic snapshot JSON build thủ công — **Trung bình** (đã nói Phần 1 D5)
- Nên tách thành `SnapshotBuilder` util.

### E4. Không có `@Service` method comment / Javadoc cho method phức tạp — **Thấp**
- Các method quan trọng (`placeOrder`, `handleVnpayCallback`, `validateAndCalculate`) không có Javadoc. Code tự mô tả được nhưng method dài cần comment.
- **Cách sửa**: Thêm Javadoc cho method > 30 dòng.

### E5. Import wildcard (`import TAWactch.example.TAWatch.order.dto.request.*`) rải rác — **Thấp**
- Một số controller/service dùng wildcard import. Java style khuyến nghị import cụ thể.
- **Cách sửa**: IDE auto-organize imports.

### E6. `PromotionService.create` và `update` có block validate date range duplicate — **Trung bình** (đã nói Phần 1 B7)
`PromotionService.java:53-60` và `72-76`

- 2 block check date range gần như giống nhau — vi phạm DRY.
- **Cách sửa**: Extract `validateDateRange(LocalDate start, LocalDate end)`.

### E7. Nhiều `if` nested trong `WatchService.enrichWatches` — **Thấp** (đọc được)
`WatchService.java:284-303`

- Có nested if cho PERCENT/FIXED discount, sau đó if `maxDiscountAmount != null`. Code dài nhưng logic rõ. Không cần refactor.

### E8. `OrderService.generateOrderCode` dùng `substring(7)` trên timestamp — **Trung bình**
`OrderService.java:444-450`

- **Vấn đề**: `String.valueOf(System.currentTimeMillis()).substring(7)` — lấy 6 ký tự cuối. Không unique, không mô tả rõ. Đã nói ở Phần 3 C9.
- **Cách sửa**: Dùng UUID hoặc format có ý nghĩa hơn (vd `ORD-yyyyMMdd-HHmmss-XXXX`).

### E9. Không có `@Validated` group cho các request phức tạp — **Thấp**
- `OrderRequest`, `PromotionRequest`, `UserRequest` dùng `@Valid` — OK cho LVTN. Không cần group.

### E10. Một số entity dùng `@EntityGraph` trong repo (`WatchVariantImageRepo`) — **Tốt**
- `@EntityGraph` fetch `variant` + `variant.watch` — tránh N+1. Pattern đúng.

---

# PHẦN 5 — FRONTEND REVIEW

## A. Loading/Error States không đầy đủ

### A1. `Checkout.jsx` — API call không có error handling đầy đủ — **Trung bình**
`Checkout.jsx:415-416, 537-538`

- **Vấn đề**: 
  - `addressService.getAddresses(user.id)` (dòng 415) chỉ `.catch(() => {})` — lỗi bị nuốt, user không biết tại sao không có địa chỉ
  - `couponService.getMyCoupons()` và `couponService.getFeatured()` (dòng 537-538) cũng `.catch(() => [])` — lỗi coupon bị ẩn
  - `cartService.getCurrentCart()` (dòng 407) catch trả null nhưng không thông báo
- **Mức độ**: Trung bình — user có thể không hiểu tại sao UI trống
- **Cách sửa**: Hiển thị toast/alert khi API lỗi, hoặc inline error message ở từng section

### A2. `Login.jsx` — Không có loading state cho Google login — **Thấp**
`Login.jsx:49-78, 80-83`

- **Vấn đề**: `handleGoogleSuccess` có `setIsSubmitting(true)` nhưng button Google (dòng 236) không disable khi `isSubmitting`
- **Cách sửa**: Pass `disabled={isSubmitting}` vào `AuthSocialButton` hoặc wrap trong div với opacity

### A3. `Register.jsx` — Tương tự A2 — **Thấp**
`Register.jsx:147-172, 174-177`

- **Vấn đề**: Google login button không disable khi đang xử lý
- **Cách sửa**: Như A2

## B. API Call dư thừa / Logic lặp

### B1. `Login.jsx` và `Register.jsx` — Logic `mergeCart` lặp lại 2 lần — **Trung bình**
`Login.jsx:59-67, 108-116` + `Register.jsx:156-164, 159-163`

- **Vấn đề**: 
  - `Login.jsx` có 2 đoạn mergeCart giống hệt nhau: dòng 59-67 (Google) và 108-116 (regular login)
  - `Register.jsx` có 1 đoạn Google (dòng 156-164), và dòng 159-163 là phần của đoạn đó
  - Logic lặp: lấy sessionId, check user.id, gọi mergeCart, dispatch event, catch error
- **Cách sửa**: Extract thành helper function `handlePostLogin(authResponse)` dùng chung cho cả Login và Register
- **Bonus**: Có thể move vào `authService.js` hoặc custom hook `useAuth`

### B2. `Login.jsx` và `Register.jsx` — Mouse move effect lặp — **Thấp**
`Login.jsx:33-42` + `Register.jsx:118-127`

- **Vấn đề**: useEffect cho gear animation giống hệt nhau ở 2 file
- **Cách sửa**: Extract thành custom hook `useGearAnimation()` hoặc tạo component `GearBackground` dùng chung

### B3. `Login.jsx` và `Register.jsx` — Google icon SVG lặp — **Thấp**
`Login.jsx:9-16` + `Register.jsx:9-16`

- **Vấn đề**: SVG Google icon copy-paste giống nhau
- **Cách sửa**: Tạo component `GoogleIcon` hoặc move vào file `icons.jsx` chung

### B4. `Checkout.jsx` — Tính phí ship có logic lặp — **Thấp**
`Checkout.jsx:431-443, 462-476`

- **Vấn đề**: 
  - `runCalcFee` (dòng 431-443) gọi `ghnService.calculateFee` cho authenticated user
  - Dòng 469-474 gọi lại cùng logic cho guest
  - Cùng pattern: check method, check districtId/wardCode, set loading, call API, catch
- **Cách sửa**: Gom thành 1 hàm `calculateShippingFee(districtId, wardCode, method)` dùng chung

### B5. `Checkout.jsx` — Coupon picker load data mỗi lần mở modal — **Thấp**
`Checkout.jsx:532-544`

- **Vấn đề**: `handleOpenCouponModal` gọi `getMyCoupons()` và `getFeatured()` mỗi lần user click "CHỌN VOUCHER". Nếu user mở/đóng modal nhiều lần → gọi API nhiều lần
- **Cách sửa**: Cache coupons trong state, chỉ fetch lại khi cần (ví dụ: sau khi áp dụng coupon xong, hoặc sau 5 phút)

## C. Validate form trước khi gửi API

### C1. `Checkout.jsx` — Validate guest info không nhất quán — **Trung bình**
`Checkout.jsx:578-592`

- **Vấn đề**: 
  - Validate guest info (dòng 578-592) chỉ chạy khi `!isAuthenticated`
  - Nhưng không validate khi `isAuthenticated` — giả định `selectedAddress` luôn có, nhưng user có thể chưa chọn địa chỉ
  - Dòng 573-576 check `!selectedAddress` nhưng không check các field khác (ví dụ: address có đủ ghnDistrictId không)
- **Cách sửa**: 
  - Validate `selectedAddress` có đủ field cần thiết (ghnDistrictId, ghnWardCode, recipientName, phone)
  - Hoặc validate ngay khi user select address

### C2. `Checkout.jsx` — Không validate paymentMethod/deliveryMethod trước khi gửi — **Thấp**
`Checkout.jsx:601-603`

- **Vấn đề**: Payload gửi `paymentMethod` và `deliveryMethod` nhưng không check có giá trị hợp lệ không (ví dụ: empty string)
- **Cách sửa**: Check `paymentMethod` và `deliveryMethod` có trong `PAYMENT_METHODS`/`DELIVERY_METHODS` trước khi gửi

### C3. `Checkout.jsx` — Coupon validate không check trùng — **Thấp**
`Checkout.jsx:499-527`

- **Vấn đề**: `applyCoupon` gọi API validate mỗi lần user click "ÁP DỤNG", ngay cả khi coupon đã được áp dụng (dòng 563-566 check `coupon.code !== couponCode.trim()` nhưng không check `appliedCoupon?.code === couponCode`)
- **Cách sửa**: Nếu `appliedCoupon?.code === couponCode`, skip API call và return `appliedCoupon`

### C4. `Register.jsx` — Validate tốt, nhưng password rule khác backend — **Thấp**
`Register.jsx:47-48` vs `RegisterRequest.java:12`

- **Vấn đề**: 
  - Frontend: `password.length < 8` (dòng 47)
  - Backend: `@Size(min = 6, message = "PASSWORD_VALID")` (RegisterRequest.java:12)
  - Frontend nghiêm hơn backend → user có thể bị confuse nếu backend accept 6 ký tự nhưng frontend reject
- **Cách sửa**: Thống nhất rule (khuyến nghị 8 ký tự cho cả frontend và backend)

## D. Code Quality / Maintainability

### D1. `Checkout.jsx` — File quá dài (943 dòng), nên tách component — **Cao**
`Checkout.jsx`

- **Vấn đề**: 943 dòng trong 1 file, chứa 5+ components: `CouponPickerModal`, `AddressPicker`, `GuestForm`, `OrderSuccess`, và main `Checkout` component
- **Mức độ**: Cao — khó maintain, khó test, khó review
- **Cách sửa**: Tách thành:
  - `components/checkout/CouponPickerModal.jsx`
  - `components/checkout/AddressPicker.jsx`
  - `components/checkout/GuestForm.jsx`
  - `components/checkout/OrderSuccess.jsx`
  - `components/checkout/OrderSummary.jsx` (aside section dòng 836-926)
  - Giữ `Checkout.jsx` chỉ làm orchestration

### D2. `Checkout.jsx` — Quá nhiều useState (20+ states) — **Trung bình**
`Checkout.jsx:379-403`

- **Vấn đề**: 20+ `useState` calls, khó quản lý, khó biết state nào liên quan nhau
- **Cách sửa**: 
  - Group related states: `useReducer` cho form data (guest, shipping, payment)
  - Hoặc tách thành custom hooks: `useCheckoutForm()`, `useCoupons()`, `useShippingFee()`

### D3. `Checkout.jsx` — Magic strings trong error handling — **Thấp**
`Checkout.jsx:632-635`

- **Vấn đề**: Check `code === 5004`, `code === 5003` — hardcoded error codes, không rõ nghĩa
- **Cách sửa**: 
  - Tạo constants: `ERROR_CODES.INSUFFICIENT_STOCK = 5004`
  - Hoặc backend trả error code name thay vì number

### D4. `cartService.js` — Recovery logic cho guest session có thể là workaround — **Thấp**
`cartService.js:65-77`

- **Vấn đề**: Check `error.message.includes('StrapMaterialType')` hoặc `IllegalArgumentException` → reset session ID và retry. Đây có vẻ là workaround cho bug backend (có thể liên quan đến enum deserialize error)
- **Cách sửa**: 
  - Fix root cause ở backend (tại sao guest cart bị lỗi enum?)
  - Nếu là workaround tạm thời, thêm comment giải thích tại sao cần

### D5. `Login.jsx` và `Register.jsx` — Console.error khi merge cart fail — **Thấp**
`Login.jsx:65, 114` + `Register.jsx:162`

- **Vấn đề**: `console.error('Failed to merge cart', err)` — production code không nên dùng console.error
- **Cách sửa**: 
  - Dùng logger library (ví dụ: `loglevel`, `winston`)
  - Hoặc xóa nếu không cần log
  - Hoặc hiển thị toast cho user biết cart merge fail

### D6. `Checkout.jsx` — Tính tổng tiền có thể bị sai nếu item không có `subtotal` — **Trung bình**
`Checkout.jsx:494`

- **Vấn đề**: `items.reduce((sum, i) => sum + (i.subtotal ?? i.unitPrice * i.quantity), 0)` — fallback `i.unitPrice * i.quantity` nếu không có `subtotal`. Nhưng backend `CartItemResponse` luôn trả `subtotal`, nên fallback này có thể là defensive code không cần thiết
- **Cách sửa**: 
  - Check backend `CartItemResponse` có luôn trả `subtotal` không
  - Nếu có, bỏ fallback và chỉ dùng `i.subtotal`
  - Nếu không, giữ fallback nhưng thêm comment

### D7. `Checkout.jsx` — Payload gửi `ghnDistrictId` và `ghnWardCode` nhưng backend có thể không cần — **Thấp**
`Checkout.jsx:598-599, 602`

- **Vấn đề**: Payload chứa `ghnDistrictId` và `ghnWardCode`, nhưng backend `OrderRequest.java` có field này không? Nếu không có, gửi thừa
- **Cách sửa**: Check `OrderRequest.java` xem có field này không, nếu không có thì bỏ

### D8. `Checkout.jsx` — Không có confirmation trước khi submit — **Thấp**
`Checkout.jsx:558-639`

- **Vấn đề**: User click "ĐẶT HÀNG" → submit ngay, không có confirmation dialog. Nếu user click nhầm → tạo đơn hàng không mong muốn
- **Cách sửa**: Thêm confirmation dialog (có thể disable nếu user chọn "Don't ask again")

## E. Security / Best Practices

### E1. `Checkout.jsx` — Guest info không sanitize trước khi gửi — **Thấp**
`Checkout.jsx:603`

- **Vấn đề**: `guestAddressDetail` được build bằng template string: `${guest.guestAddressDetail}, ${guest.guestWard}, ${guest.guestDistrict}, ${guest.guestProvince}`. Nếu user nhập XSS payload (ví dụ: `<script>alert(1)</script>`), có thể bị lưu vào DB
- **Cách sửa**: 
  - Backend nên sanitize/escape trước khi lưu (đã nói ở Phần 1 D5)
  - Frontend có thể escape HTML entities trước khi gửi (optional, defense in depth)

### E2. `Login.jsx` và `Register.jsx` — Token lưu localStorage (XSS risk) — **Trung bình**
`Login.jsx:55-57, 97-106` + `Register.jsx:152-154`

- **Vấn đề**: JWT token lưu `localStorage` — nếu app có XSS vulnerability, attacker có thể steal token
- **Mức độ**: Trung bình — acceptable cho LVTN nhưng cần biết risk
- **Cách sửa**: 
  - Tốt nhất: lưu httpOnly cookie (backend set cookie, frontend không access được)
  - Hoặc: dùng memory storage (sessionStorage) thay vì localStorage
  - Hoặc: refresh token pattern (access token ngắn hạn, refresh token httpOnly)

### E3. `Checkout.jsx` — Không có CSRF token khi gửi form — **Thấp**
`Checkout.jsx:605`

- **Vấn đề**: `orderService.createOrder(payload)` không gửi CSRF token. Nhưng backend `SecurityConfig.java:76` đã `csrf.disable()` vì dùng JWT stateless
- **Cách sửa**: Không cần fix, backend đã disable CSRF cho stateless API

### E4. `apiClient.js` — Auto logout khi 401/403 có thể gây UX issue — **Thấp**
`apiClient.js:64-73`

- **Vấn đề**: Khi nhận 401/403, clear auth và redirect `/login`. Nhưng nếu user đang ở `/checkout` và token hết hạn → mất hết form data
- **Cách sửa**: 
  - Lưu form data vào sessionStorage trước khi redirect
  - Hoặc: refresh token trước khi logout (nếu có refresh token)

## F. Accessibility

### F1. `Checkout.jsx` — Thiếu aria-label cho icon buttons — **Thấp**
`Checkout.jsx:66, 788-794`

- **Vấn đề**: 
  - Close button (dòng 66): `<button onClick={onClose} className="material-symbols-outlined">close</button>` — thiếu `aria-label="Close"`
  - Remove coupon button (dòng 788-794): có `title` nhưng thiếu `aria-label`
- **Cách sửa**: Thêm `aria-label` cho screen readers

### F2. `Checkout.jsx` — Radio buttons không dùng `<input type="radio">` — **Thấp**
`Checkout.jsx:43-55`

- **Vấn đề**: `RadioCard` component dùng `<button>` thay vì `<input type="radio">` + `<label>`. Screen readers có thể không nhận ra đây là radio group
- **Cách sửa**: 
  - Dùng `<input type="radio" hidden>` + `<label>` với `role="radio"` và `aria-checked`
  - Hoặc: thêm `role="radio"` và `aria-checked={selected}` vào `<button>`

### F3. `Login.jsx` và `Register.jsx` — Password visibility toggle không announce state — **Thấp**
`Login.jsx:206-217` + `Register.jsx:95-101`

- **Vấn đề**: Toggle button có `aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}` nhưng không announce khi state thay đổi
- **Cách sửa**: Thêm `aria-live="polite"` region để announce "Password visible" / "Password hidden"

## G. Performance

### G1. `Checkout.jsx` — Re-render nhiều khi state thay đổi — **Trung bình**
`Checkout.jsx`

- **Vấn đề**: 20+ useState → mỗi lần setState → component re-render toàn bộ tree. Các child components (`CouponPickerModal`, `AddressPicker`, etc.) cũng re-render
- **Cách sửa**: 
  - Dùng `React.memo` cho child components
  - Dùng `useCallback` cho handler functions
  - Dùng `useMemo` cho computed values (subtotal, totalAmount)

### G2. `Checkout.jsx` — Items filter không memoize — **Thấp**
`Checkout.jsx:491-493`

- **Vấn đề**: `items` computed từ `allCartItems.filter(...)` mỗi lần render, ngay cả khi `selectedItemIds` không đổi
- **Cách sửa**: `const items = useMemo(() => selectedItemIds ? allCartItems.filter(...) : allCartItems, [selectedItemIds, allCartItems])`

### G3. `Checkout.jsx` — Coupon modal fetch data mỗi lần mở (đã nói B5) — **Thấp**
(Trùng B5)

## H. Tổng kết Frontend

### Điểm mạnh:
- Form validation tốt ở `Register.jsx`
- Loading states có ở hầu hết components
- Error handling có ở các form submit
- UI/UX design đẹp, consistent

### Điểm cần cải thiện:
1. **Cao**: Tách `Checkout.jsx` thành nhiều components (D1)
2. **Trung bình**: Gom logic mergeCart, mouse effect, Google icon (B1, B2, B3)
3. **Trung bình**: Group related states bằng useReducer (D2)
4. **Trung bình**: Loading/error states đầy đủ hơn (A1)
5. **Thấp**: Accessibility improvements (F1, F2, F3)
6. **Thấp**: Console.log cleanup (D5)
7. **Thấp**: Performance optimizations (G1, G2)

### Ưu tiên sửa:
1. **Trước bảo vệ**: D1 (tách Checkout.jsx), B1 (gom mergeCart logic)
2. **Sau bảo vệ**: D2 (useReducer), A1 (error handling), G1 (performance)
3. **Nice to have**: F1-F3 (accessibility), D5 (console.log)

---

**HẾT** — Review hoàn thành 5 phần: Logic nghiệp vụ, Bảo mật, Hiệu năng, Code convention, Frontend.
