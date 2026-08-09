# TAWatch — Tài liệu Database Schema

**Database:** `TAwatch`  
**Engine:** InnoDB | **Charset:** utf8mb4_unicode_ci  
**Tổng số bảng:** 25

---

## Mục lục

1. [Sơ đồ quan hệ tổng quát](#sơ-đồ-quan-hệ-tổng-quát)
2. [Danh mục Enum & Hằng số](#danh-mục-enum--hằng-số)
3. [Chi tiết từng bảng](#chi-tiết-từng-bảng)
4. [Indexes](#indexes)
5. [Ghi chú thiết kế](#ghi-chú-thiết-kế)

---

## Sơ đồ quan hệ tổng quát

```
brand ──────────────────────────── supplier
  │                                    │
  │◄── supplier_brand ────────────────►│
  │
  └──► watch ──► watch_variant ──► watch_image
         │            │
         │            ├──► cart_item ──► cart ──► user
         │            ├──► order_item ──► order ──► user
         │            ├──► promotion (slow-moving)
         │            ├──► import_receipt_item
         │            └──► wishlist
         │
         └──► review ──► order ──► user

user ──► user_address ──► order
user ──► otp_verification
user ──► refresh_token
user ──► admin_log

order ──► order_item
order ──► order_status_history
order ──► payment_transaction
order ──► return_request ──► return_item ──► order_item

promotion ──► coupon ──► order

segment ──► watch
category ──► watch
shipper ──► order
```

---

## Danh mục Enum & Hằng số

| Enum | Giá trị | Dùng ở bảng |
|------|---------|-------------|
| `role` | `CUSTOMER`, `ADMIN`, `STAFF` | user |
| `auth_provider` | `LOCAL`, `GOOGLE` | user |
| `movement_type` | `AUTOMATIC`, `MANUAL`, `QUARTZ`, `SOLAR`, `SMART` | watch |
| `delivery_method` | `EXTERNAL_SHIPPER`, `DIRECT_SHOP` | segment, order |
| `order_status` | `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPING`, `DELIVERED`, `CANCELLED`, `RETURNED` | order, order_status_history |
| `payment_method` | `COD`, `VNPAY` | order |
| `payment_status` | `PENDING`, `PAID`, `FAILED`, `REFUNDED` | order |
| `gateway` | `VNPAY`, `COD` | payment_transaction |
| `promo_type` | `EVENT`, `LOYALTY_PURCHASE_COUNT`, `SLOW_MOVING_STOCK` | promotion |
| `discount_type` | `PERCENT`, `FIXED_AMOUNT` | promotion |
| `return_status` | `PENDING`, `APPROVED`, `REJECTED`, `COMPLETED` | return_request |
| `refund_method` | `COD_REFUND`, `VNPAY_REFUND`, `STORE_CREDIT` | return_request |
| `import_status` | `DRAFT`, `APPROVED`, `CANCELLED` | import_receipt |
| `otp_purpose` | `REGISTER`, `GOOGLE_VERIFY`, `FORGOT_PASSWORD` | otp_verification |

---

## Chi tiết từng bảng

---

### 1. `brand` — Thương hiệu

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(100) | NO | — | Tên thương hiệu |
| `country` | VARCHAR(100) | YES | — | Quốc gia xuất xứ |
| `description` | TEXT | YES | — | Mô tả thương hiệu |
| `logo_url` | VARCHAR(500) | YES | — | URL logo |
| `is_active` | TINYINT(1) | NO | `1` | Trạng thái hoạt động |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

---

### 2. `supplier` — Nhà cung cấp

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(200) | NO | — | Tên nhà cung cấp |
| `email` | VARCHAR(150) | NO | — | Email liên hệ |
| `phone` | VARCHAR(20) | NO | — | Số điện thoại |
| `address` | TEXT | YES | — | Địa chỉ |
| `is_active` | TINYINT(1) | NO | `1` | Trạng thái |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

---

### 3. `supplier_brand` — Nhà cung cấp × Thương hiệu (N-N)

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `supplier_id` | INT | NO | FK → supplier(id) ON DELETE CASCADE |
| `brand_id` | INT | NO | FK → brand(id) ON DELETE CASCADE |

**PK:** `(supplier_id, brand_id)`

---

### 4. `category` — Danh mục sản phẩm (đa cấp)

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(150) | NO | — | Tên danh mục |
| `slug` | VARCHAR(200) | NO | — | Slug URL (UNIQUE) |
| `parent_id` | INT | YES | `NULL` | FK → category(id), danh mục cha |

> Hỗ trợ cây danh mục đa cấp. `parent_id = NULL` là danh mục gốc.

---

### 5. `segment` — Phân khúc thị trường

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(100) | NO | — | Tên phân khúc |
| `delivery_method` | ENUM | NO | `EXTERNAL_SHIPPER` | Phương thức giao hàng |

**Dữ liệu mặc định:**

| id | name | delivery_method |
|----|------|----------------|
| 1 | Bình dân | EXTERNAL_SHIPPER |
| 2 | Trung cấp | EXTERNAL_SHIPPER |
| 3 | Luxury | DIRECT_SHOP |

> Đồng hồ Luxury được giao qua nhân viên cửa hàng (`DIRECT_SHOP`), không qua GHTK/GHN.

---

### 6. `watch` — Sản phẩm đồng hồ (thông tin chung)

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `sku` | VARCHAR(50) | NO | — | Mã SKU (UNIQUE) |
| `name` | VARCHAR(255) | NO | — | Tên sản phẩm |
| `brand_id` | INT | NO | — | FK → brand(id) |
| `category_id` | INT | NO | — | FK → category(id) |
| `segment_id` | INT | NO | — | FK → segment(id) |
| `description` | TEXT | YES | — | Mô tả chi tiết |
| `movement_type` | ENUM | NO | — | Loại máy (AUTOMATIC/MANUAL/QUARTZ/SOLAR/SMART) |
| `glass_material` | VARCHAR(100) | YES | — | Vật liệu kính (Sapphire, Mineral, Acrylic...) |
| `thickness_mm` | DECIMAL(5,2) | YES | — | Độ dày (mm) |
| `water_resistance_atm` | DECIMAL(5,1) | YES | — | Chống nước (ATM) |
| `power_reserve_hours` | INT | YES | — | Khoảng trữ cót (giờ) — dành cho máy cơ |
| `battery_type` | VARCHAR(50) | YES | — | Loại pin — dành cho đồng hồ Quartz |
| `features` | TEXT | YES | — | Tiện ích: lịch, báo thức, GPS... |
| `is_active` | TINYINT(1) | NO | `1` | Hiển thị / ẩn |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

---

### 7. `watch_variant` — Biến thể sản phẩm

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `watch_id` | INT | NO | — | FK → watch(id) ON DELETE CASCADE |
| `dial_color` | VARCHAR(80) | YES | — | Màu mặt số |
| `strap_color` | VARCHAR(80) | YES | — | Màu dây |
| `strap_material` | VARCHAR(100) | YES | — | Chất liệu dây (da, thép, cao su...) |
| `case_size_mm` | DECIMAL(5,2) | YES | — | Kích thước mặt (mm) |
| `price` | DECIMAL(15,0) | NO | — | Giá bán |
| `image_url` | VARCHAR(500) | YES | — | Ảnh đại diện biến thể |
| `stock_quantity` | INT | NO | `0` | Số lượng tồn kho |
| `is_active` | TINYINT(1) | NO | `1` | Trạng thái |

> Mỗi `watch` có thể có nhiều `watch_variant`. Tồn kho quản lý ở cấp variant.

---

### 8. `watch_image` — Ảnh sản phẩm

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `watch_id` | INT | NO | — | FK → watch(id) ON DELETE CASCADE |
| `url` | VARCHAR(500) | NO | — | URL ảnh |
| `alt_text` | VARCHAR(255) | YES | — | Alt text SEO |
| `is_primary` | TINYINT(1) | NO | `0` | Ảnh đại diện chính |
| `sort_order` | INT | NO | `0` | Thứ tự hiển thị |

---

### 9. `user` — Tài khoản người dùng

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `username` | VARCHAR(80) | YES | — | Tên đăng nhập (UNIQUE) |
| `email` | VARCHAR(150) | NO | — | Email (UNIQUE) |
| `password_hash` | VARCHAR(255) | YES | — | Mật khẩu đã hash (NULL nếu đăng nhập Google) |
| `full_name` | VARCHAR(200) | YES | — | Họ tên đầy đủ |
| `phone` | VARCHAR(20) | YES | — | Số điện thoại |
| `birthday` | DATE | YES | — | Ngày sinh *(thêm sau)* |
| `auth_provider` | ENUM | NO | `LOCAL` | Phương thức đăng nhập (LOCAL/GOOGLE) |
| `google_id` | VARCHAR(200) | YES | — | Sub từ Google OAuth (UNIQUE) |
| `role` | ENUM | NO | `CUSTOMER` | Vai trò (CUSTOMER/ADMIN/STAFF) |
| `loyalty_points` | INT | NO | `0` | Điểm tích lũy |
| `is_active` | TINYINT(1) | NO | `1` | Tài khoản kích hoạt |
| `is_verified` | TINYINT(1) | NO | `0` | Email đã xác thực OTP |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

---

### 10. `user_address` — Địa chỉ giao hàng đã lưu

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `user_id` | INT | NO | — | FK → user(id) ON DELETE CASCADE |
| `recipient_name` | VARCHAR(200) | NO | — | Tên người nhận |
| `phone` | VARCHAR(20) | NO | — | SĐT người nhận |
| `address_detail` | TEXT | NO | — | Số nhà, tên đường |
| `province` | VARCHAR(100) | NO | — | Tỉnh / Thành phố |
| `district` | VARCHAR(100) | NO | — | Quận / Huyện |
| `ward` | VARCHAR(100) | NO | — | Phường / Xã |
| `is_default` | TINYINT(1) | NO | `0` | Địa chỉ mặc định |

---

### 11. `cart` — Giỏ hàng

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `user_id` | INT | YES | `NULL` | FK → user(id) — NULL nếu là guest |
| `session_id` | VARCHAR(128) | YES | `NULL` | Session ID cho guest |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

### 11b. `cart_item` — Chi tiết giỏ hàng

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `cart_id` | INT | NO | — | FK → cart(id) ON DELETE CASCADE |
| `watch_variant_id` | INT | NO | — | FK → watch_variant(id) |
| `quantity` | INT | NO | `1` | Số lượng |
| `unit_price` | DECIMAL(15,0) | NO | — | Giá tại thời điểm thêm vào giỏ |

> `unit_price` được lưu snapshot để giữ giá tại lúc thêm vào giỏ, không bị ảnh hưởng bởi thay đổi giá sau này.

---

### 12. `promotion` — Chương trình khuyến mãi

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(255) | NO | — | Tên chương trình |
| `promo_type` | ENUM | NO | — | Loại KM (EVENT/LOYALTY_PURCHASE_COUNT/SLOW_MOVING_STOCK) |
| `discount_type` | ENUM | NO | — | Loại giảm giá (PERCENT/FIXED_AMOUNT) |
| `discount_value` | DECIMAL(10,2) | NO | — | Giá trị giảm |
| `min_order_value` | DECIMAL(15,0) | NO | `0` | Giá trị đơn tối thiểu |
| `max_discount_amount` | DECIMAL(15,0) | YES | — | Giảm tối đa (cho PERCENT) |
| `max_uses` | INT | YES | — | Tổng lượt dùng tối đa |
| `used_count` | INT | NO | `0` | Số lượt đã dùng |
| `min_purchase_count` | INT | NO | `0` | Số lần mua tối thiểu (cho loyalty) |
| `watch_variant_id` | INT | YES | `NULL` | FK → watch_variant — áp dụng riêng biến thể slow-moving |
| `applies_to_all` | TINYINT(1) | NO | `1` | Áp dụng toàn đơn |
| `start_date` | DATETIME | NO | — | Ngày bắt đầu |
| `end_date` | DATETIME | NO | — | Ngày kết thúc |
| `is_active` | TINYINT(1) | NO | `1` | Trạng thái |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |

**Phân loại promo_type:**
- `EVENT`: Sự kiện (lễ, Tết, flash sale...)
- `LOYALTY_PURCHASE_COUNT`: Khách hàng mua đủ `min_purchase_count` lần được hưởng KM
- `SLOW_MOVING_STOCK`: Giảm giá cho biến thể cụ thể ít bán chạy

---

### 13. `coupon` — Mã giảm giá

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `promotion_id` | INT | NO | — | FK → promotion(id) |
| `code` | VARCHAR(50) | NO | — | Mã coupon (UNIQUE) |
| `user_id` | INT | YES | `NULL` | FK → user(id) — NULL = dùng chung; có giá trị = riêng user đó |
| `is_used` | TINYINT(1) | NO | `0` | Đã sử dụng |
| `used_at` | TIMESTAMP | YES | — | Thời điểm sử dụng |
| `expires_at` | DATETIME | YES | — | Hạn sử dụng |

---

### 14. `shipper` — Đơn vị vận chuyển

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `name` | VARCHAR(100) | NO | — | Tên đơn vị (GHTK, GHN...) |
| `api_endpoint` | VARCHAR(500) | YES | — | Endpoint API tích hợp |
| `api_key` | VARCHAR(500) | YES | — | API key |
| `is_active` | TINYINT(1) | NO | `1` | Trạng thái |

---

### 15. `order` — Đơn hàng

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `order_code` | VARCHAR(30) | NO | — | Mã đơn hàng (UNIQUE) |
| `user_id` | INT | YES | `NULL` | FK → user(id) — NULL nếu guest |
| `guest_email` | VARCHAR(150) | YES | — | Email guest |
| `guest_phone` | VARCHAR(20) | YES | — | SĐT guest |
| `guest_name` | VARCHAR(200) | YES | — | Tên guest |
| `address_id` | INT | YES | `NULL` | FK → user_address(id) |
| `shipping_address_snapshot` | TEXT | NO | — | Snapshot địa chỉ lúc đặt hàng |
| `subtotal` | DECIMAL(15,0) | NO | — | Tổng tiền hàng (chưa giảm, chưa ship) |
| `discount_amount` | DECIMAL(15,0) | NO | `0` | Tổng tiền giảm |
| `shipping_fee` | DECIMAL(15,0) | NO | `0` | Phí vận chuyển |
| `total_amount` | DECIMAL(15,0) | NO | — | Tổng thanh toán = subtotal - discount + shipping |
| `coupon_id` | INT | YES | `NULL` | FK → coupon(id) |
| `payment_method` | ENUM | NO | — | COD / VNPAY |
| `payment_status` | ENUM | NO | `PENDING` | Trạng thái thanh toán |
| `order_status` | ENUM | NO | `PENDING` | Trạng thái đơn hàng |
| `delivery_method` | ENUM | NO | — | EXTERNAL_SHIPPER / DIRECT_SHOP |
| `tracking_code` | VARCHAR(100) | YES | — | Mã vận đơn GHTK/GHN |
| `shipper_id` | INT | YES | `NULL` | FK → shipper(id) |
| `note` | TEXT | YES | — | Ghi chú đơn hàng |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày đặt hàng |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

**Luồng trạng thái đơn hàng:**
```
PENDING → CONFIRMED → PROCESSING → SHIPPING → DELIVERED
                   ↘ CANCELLED
                                           ↘ RETURNED
```

---

### 16. `order_item` — Chi tiết đơn hàng

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `order_id` | INT | NO | — | FK → order(id) ON DELETE CASCADE |
| `watch_variant_id` | INT | NO | — | FK → watch_variant(id) |
| `product_snapshot` | JSON | NO | — | Snapshot sản phẩm lúc mua (tên, ảnh, màu, size) |
| `quantity` | INT | NO | — | Số lượng |
| `unit_price` | DECIMAL(15,0) | NO | — | Đơn giá |
| `total_price` | DECIMAL(15,0) | NO | — | = quantity × unit_price |

---

### 17. `order_status_history` — Lịch sử trạng thái đơn

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `order_id` | INT | NO | — | FK → order(id) ON DELETE CASCADE |
| `status` | ENUM | NO | — | Trạng thái mới |
| `note` | VARCHAR(500) | YES | — | Ghi chú thay đổi |
| `changed_by` | INT | YES | `NULL` | FK → user(id) — admin/staff thực hiện |
| `changed_at` | TIMESTAMP | NO | `NOW()` | Thời điểm thay đổi |

---

### 18. `payment_transaction` — Giao dịch thanh toán

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `order_id` | INT | NO | — | FK → order(id) ON DELETE CASCADE |
| `transaction_code` | VARCHAR(100) | YES | — | Mã giao dịch từ cổng thanh toán (UNIQUE) |
| `gateway` | ENUM | NO | — | VNPAY / COD |
| `amount` | DECIMAL(15,0) | NO | — | Số tiền giao dịch |
| `status` | ENUM | NO | `PENDING` | PENDING / SUCCESS / FAILED / REFUNDED |
| `response_data` | JSON | YES | — | Raw response từ VNPay IPN |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

---

### 19. `return_request` — Yêu cầu đổi/trả hàng

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `order_id` | INT | NO | — | FK → order(id) |
| `user_id` | INT | NO | — | FK → user(id) |
| `reason` | TEXT | NO | — | Lý do đổi/trả |
| `status` | ENUM | NO | `PENDING` | PENDING/APPROVED/REJECTED/COMPLETED |
| `refund_method` | ENUM | YES | `NULL` | Phương thức hoàn tiền |
| `refund_amount` | DECIMAL(15,0) | YES | `NULL` | Số tiền hoàn |
| `admin_note` | TEXT | YES | — | Ghi chú của admin |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

### 19b. `return_item` — Chi tiết sản phẩm đổi/trả

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `id` | INT | NO | Khóa chính |
| `return_id` | INT | NO | FK → return_request(id) ON DELETE CASCADE |
| `order_item_id` | INT | NO | FK → order_item(id) |
| `quantity` | INT | NO | Số lượng trả |
| `condition_note` | TEXT | YES | Tình trạng sản phẩm trả về |

---

### 20. `wishlist` — Danh sách yêu thích

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `id` | INT | NO | Khóa chính |
| `user_id` | INT | NO | FK → user(id) ON DELETE CASCADE |
| `watch_variant_id` | INT | NO | FK → watch_variant(id) ON DELETE CASCADE |
| `added_at` | TIMESTAMP | NO | Thời điểm thêm |

**UNIQUE:** `(user_id, watch_variant_id)` — mỗi user chỉ thêm 1 lần mỗi variant.

---

### 21. `review` — Đánh giá sản phẩm

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `user_id` | INT | NO | — | FK → user(id) |
| `watch_id` | INT | NO | — | FK → watch(id) |
| `order_id` | INT | NO | — | FK → order(id) — chỉ review sau khi đã mua |
| `rating` | TINYINT | NO | — | Điểm 1–5 (CHECK constraint) |
| `comment` | TEXT | YES | — | Nội dung đánh giá |
| `is_approved` | TINYINT(1) | NO | `0` | Admin phê duyệt trước khi hiển thị |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày đánh giá |

**UNIQUE:** `(user_id, watch_id, order_id)` — mỗi user chỉ review 1 lần mỗi sản phẩm trong 1 đơn.

---

### 22. `import_receipt` — Phiếu nhập kho

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `receipt_code` | VARCHAR(30) | NO | — | Mã phiếu nhập (UNIQUE) |
| `supplier_id` | INT | NO | — | FK → supplier(id) |
| `created_by` | INT | NO | — | FK → user(id) — admin/staff tạo phiếu |
| `total_amount` | DECIMAL(15,0) | NO | `0` | Tổng giá trị nhập |
| `status` | ENUM | NO | `DRAFT` | DRAFT/APPROVED/CANCELLED |
| `note` | TEXT | YES | — | Ghi chú |
| `import_date` | DATE | NO | — | Ngày nhập hàng |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo phiếu |
| `updated_at` | TIMESTAMP | NO | `NOW()` | Ngày cập nhật |

### 22b. `import_receipt_item` — Chi tiết phiếu nhập

| Cột | Kiểu | Nullable | Mô tả |
|-----|------|----------|-------|
| `id` | INT | NO | Khóa chính |
| `receipt_id` | INT | NO | FK → import_receipt(id) ON DELETE CASCADE |
| `watch_variant_id` | INT | NO | FK → watch_variant(id) |
| `quantity` | INT | NO | Số lượng nhập |
| `unit_cost` | DECIMAL(15,0) | NO | Giá nhập / đơn vị |
| `total_cost` | DECIMAL(15,0) | NO | = quantity × unit_cost |
| `batch_number` | VARCHAR(50) | YES | Số lô hàng |
| `expiry_date` | DATE | YES | Hạn bảo hành / hạn dùng |

---

### 23. `admin_log` — Audit log

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `admin_id` | INT | NO | — | FK → user(id) |
| `action` | VARCHAR(100) | NO | — | Hành động (CREATE/UPDATE/DELETE/APPROVE...) |
| `table_name` | VARCHAR(100) | NO | — | Tên bảng bị tác động |
| `record_id` | INT | YES | — | ID bản ghi bị tác động |
| `old_value` | JSON | YES | — | Giá trị trước khi thay đổi |
| `new_value` | JSON | YES | — | Giá trị sau khi thay đổi |
| `ip_address` | VARCHAR(45) | YES | — | IP của admin |
| `created_at` | TIMESTAMP | NO | `NOW()` | Thời điểm ghi log |

---

### 24. `otp_verification` — Xác thực OTP

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `email` | VARCHAR(150) | NO | — | Email nhận OTP |
| `otp_code` | VARCHAR(10) | NO | — | Mã OTP 6 số |
| `purpose` | ENUM | NO | — | REGISTER/GOOGLE_VERIFY/FORGOT_PASSWORD |
| `is_used` | TINYINT(1) | NO | `0` | Đã dùng |
| `attempts` | TINYINT | NO | `0` | Số lần nhập sai (tối đa 5) |
| `expires_at` | DATETIME | NO | — | Thời hạn OTP |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |

**Indexes:** `idx_otp_email(email)`, `idx_otp_expires(expires_at)`

---

### 25. `refresh_token` — Quản lý Refresh Token

| Cột | Kiểu | Nullable | Mặc định | Mô tả |
|-----|------|----------|----------|-------|
| `id` | INT | NO | AUTO_INCREMENT | Khóa chính |
| `user_id` | INT | NO | — | FK → user(id) ON DELETE CASCADE |
| `token_hash` | VARCHAR(255) | NO | — | SHA-256 của token thực (UNIQUE) |
| `device_info` | VARCHAR(255) | YES | — | User-Agent / tên thiết bị |
| `ip_address` | VARCHAR(45) | YES | — | IP đăng nhập |
| `is_revoked` | TINYINT(1) | NO | `0` | Đã thu hồi |
| `expires_at` | DATETIME | NO | — | Thời hạn token |
| `created_at` | TIMESTAMP | NO | `NOW()` | Ngày tạo |
| `last_used_at` | TIMESTAMP | NO | `NOW()` | Lần dùng gần nhất |

**Indexes:** `idx_rt_user(user_id)`, `idx_rt_expires(expires_at)`

---

## Indexes

| Index | Bảng | Cột | Mục đích |
|-------|------|-----|---------|
| `idx_watch_brand` | watch | brand_id | Lọc đồng hồ theo thương hiệu |
| `idx_watch_segment` | watch | segment_id | Lọc theo phân khúc |
| `idx_watch_category` | watch | category_id | Lọc theo danh mục |
| `idx_watch_variant` | watch_variant | watch_id | Lấy biến thể của sản phẩm |
| `idx_order_user` | order | user_id | Lịch sử đơn hàng của user |
| `idx_order_status` | order | order_status | Lọc đơn theo trạng thái |
| `idx_order_created` | order | created_at | Sắp xếp đơn theo ngày |
| `idx_coupon_code` | coupon | code | Tra cứu mã coupon |
| `idx_promotion_dates` | promotion | start_date, end_date | Kiểm tra KM đang hiệu lực |
| `idx_review_watch` | review | watch_id | Lấy đánh giá của sản phẩm |
| `idx_import_supplier` | import_receipt | supplier_id | Lịch sử nhập hàng theo NCC |
| `idx_cart_session` | cart | session_id | Tra cứu giỏ hàng guest |
| `idx_admin_log_admin` | admin_log | admin_id, created_at | Audit log theo admin và thời gian |

---

## Ghi chú thiết kế

### Snapshot pattern
- `cart_item.unit_price` — lưu giá tại thời điểm thêm vào giỏ
- `order.shipping_address_snapshot` — lưu địa chỉ tại thời điểm đặt hàng
- `order_item.product_snapshot` (JSON) — lưu thông tin sản phẩm tại thời điểm mua

Đảm bảo dữ liệu lịch sử không bị ảnh hưởng khi thông tin gốc thay đổi.

### Guest checkout
`order` và `cart` đều hỗ trợ guest: `user_id = NULL`, thay bằng `guest_email/guest_phone/guest_name` hoặc `session_id`.

### Security tokens
- `refresh_token.token_hash` lưu SHA-256 của token thực — không bao giờ lưu raw token
- `otp_verification.attempts` giới hạn 5 lần nhập sai chống brute-force

### Tồn kho
Tồn kho quản lý tại `watch_variant.stock_quantity`. Khi phiếu nhập (`import_receipt`) được `APPROVED`, cần trigger/service cộng thêm vào `stock_quantity`.

### Phân khúc Luxury
`segment.delivery_method = DIRECT_SHOP` → đơn hàng luxury không dùng GHTK/GHN, `shipper_id = NULL`, giao bằng nhân viên cửa hàng.
