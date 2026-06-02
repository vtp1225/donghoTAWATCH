-- ============================================================
-- WATCH STORE DATABASE SCHEMA
-- ============================================================
use TAwatch;
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. BRAND (Thương hiệu)
-- ------------------------------------------------------------
CREATE TABLE brand (
                       id          INT AUTO_INCREMENT PRIMARY KEY,
                       name        VARCHAR(100) NOT NULL,
                       country     VARCHAR(100),
                       description TEXT,
                       logo_url    VARCHAR(500),
                       is_active   TINYINT(1) NOT NULL DEFAULT 1,
                       created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. SUPPLIER (Nhà cung cấp)
-- ------------------------------------------------------------
CREATE TABLE supplier (
                          id         INT AUTO_INCREMENT PRIMARY KEY,
                          name       VARCHAR(200) NOT NULL,
                          email      VARCHAR(150) NOT NULL,
                          phone      VARCHAR(20)  NOT NULL,
                          address    TEXT,
                          is_active  TINYINT(1) NOT NULL DEFAULT 1,
                          created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. SUPPLIER_BRAND (NCC cung cấp hãng nào)
-- ------------------------------------------------------------
CREATE TABLE supplier_brand (
                                supplier_id INT NOT NULL,
                                brand_id    INT NOT NULL,
                                PRIMARY KEY (supplier_id, brand_id),
                                CONSTRAINT fk_sb_supplier FOREIGN KEY (supplier_id) REFERENCES supplier(id) ON DELETE CASCADE,
                                CONSTRAINT fk_sb_brand    FOREIGN KEY (brand_id)    REFERENCES brand(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. CATEGORY (Danh mục sản phẩm, hỗ trợ đa cấp)
-- ------------------------------------------------------------
CREATE TABLE category (
                          id        INT AUTO_INCREMENT PRIMARY KEY,
                          name      VARCHAR(150) NOT NULL,
                          slug      VARCHAR(200) NOT NULL UNIQUE,
                          parent_id INT DEFAULT NULL,
                          CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. SEGMENT (Phân khúc: bình dân / trung cấp / luxury)
--    delivery_method: EXTERNAL_SHIPPER | DIRECT_SHOP
-- ------------------------------------------------------------
CREATE TABLE segment (
                         id              INT AUTO_INCREMENT PRIMARY KEY,
                         name            VARCHAR(100) NOT NULL,
                         delivery_method ENUM('EXTERNAL_SHIPPER','DIRECT_SHOP') NOT NULL DEFAULT 'EXTERNAL_SHIPPER'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO segment (name, delivery_method) VALUES
                                                ('Bình dân', 'EXTERNAL_SHIPPER'),
                                                ('Trung cấp', 'EXTERNAL_SHIPPER'),
                                                ('Luxury',    'DIRECT_SHOP');

-- ------------------------------------------------------------
-- 6. WATCH (Sản phẩm đồng hồ — thông tin chung)
--    movement_type: AUTOMATIC | MANUAL | QUARTZ | SOLAR | SMART
-- ------------------------------------------------------------
CREATE TABLE watch (
                       id                    INT AUTO_INCREMENT PRIMARY KEY,
                       sku                   VARCHAR(50)  NOT NULL UNIQUE,
                       name                  VARCHAR(255) NOT NULL,
                       brand_id              INT NOT NULL,
                       category_id           INT NOT NULL,
                       segment_id            INT NOT NULL,
                       description           TEXT,
                       movement_type         ENUM('AUTOMATIC','MANUAL','QUARTZ','SOLAR','SMART') NOT NULL,
                       glass_material        VARCHAR(100) COMMENT 'Sapphire / Mineral / Acrylic...',
                       thickness_mm          DECIMAL(5,2) COMMENT 'Độ dày (mm)',
                       water_resistance_atm  DECIMAL(5,1) COMMENT 'Chống nước (ATM)',
                       power_reserve_hours   INT          COMMENT 'Khoảng trữ cót (giờ)',
                       battery_type          VARCHAR(50)  COMMENT 'Loại pin nếu là quartz',
                       features              TEXT         COMMENT 'Tiện ích: lịch, báo thức, GPS...',
                       is_active             TINYINT(1) NOT NULL DEFAULT 1,
                       created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       updated_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                       CONSTRAINT fk_w_brand    FOREIGN KEY (brand_id)    REFERENCES brand(id),
                       CONSTRAINT fk_w_category FOREIGN KEY (category_id) REFERENCES category(id),
                       CONSTRAINT fk_w_segment  FOREIGN KEY (segment_id)  REFERENCES segment(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. WATCH_VARIANT (Biến thể: màu mặt / màu dây / chất liệu dây)
-- ------------------------------------------------------------
CREATE TABLE watch_variant (
                               id             INT AUTO_INCREMENT PRIMARY KEY,
                               watch_id       INT NOT NULL,
                               dial_color     VARCHAR(80)    COMMENT 'Màu mặt số',
                               strap_color    VARCHAR(80)    COMMENT 'Màu dây',
                               strap_material VARCHAR(100)   COMMENT 'Chất liệu dây: da / thép / cao su...',
                               case_size_mm   DECIMAL(5,2)   COMMENT 'Kích thước mặt (mm)',
                               price          DECIMAL(15,0) NOT NULL,
                               image_url      VARCHAR(500)   COMMENT 'Ảnh đại diện biến thể',
                               stock_quantity INT NOT NULL DEFAULT 0,
                               is_active      TINYINT(1) NOT NULL DEFAULT 1,
                               CONSTRAINT fk_wv_watch FOREIGN KEY (watch_id) REFERENCES watch(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. WATCH_IMAGE (Ảnh sản phẩm)
-- ------------------------------------------------------------
CREATE TABLE watch_image (
                             id         INT AUTO_INCREMENT PRIMARY KEY,
                             watch_id   INT NOT NULL,
                             url        VARCHAR(500) NOT NULL,
                             alt_text   VARCHAR(255),
                             is_primary TINYINT(1) NOT NULL DEFAULT 0,
                             sort_order INT NOT NULL DEFAULT 0,
                             CONSTRAINT fk_wi_watch FOREIGN KEY (watch_id) REFERENCES watch(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. WATCH_VARIANT_IMAGE (Ảnh biến thể đồng hồ)
-- ------------------------------------------------------------
CREATE TABLE watch_variant_image (
                                     id         INT AUTO_INCREMENT PRIMARY KEY,
                                     variant_id INT NOT NULL,
                                     url        VARCHAR(500) NOT NULL,
                                     alt_text   VARCHAR(255),
                                     is_primary TINYINT(1) NOT NULL DEFAULT 0,
                                     sort_order INT NOT NULL DEFAULT 0,
                                     CONSTRAINT fk_wvi_variant FOREIGN KEY (variant_id) REFERENCES watch_variant(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 11. USER (Tài khoản người dùng)
--    auth_provider: LOCAL | GOOGLE
--    role: CUSTOMER | ADMIN | STAFF
-- ------------------------------------------------------------
CREATE TABLE user (
                      id             INT AUTO_INCREMENT PRIMARY KEY,
                      username       VARCHAR(80) UNIQUE,
                      email          VARCHAR(150) NOT NULL UNIQUE,
                      password_hash  VARCHAR(255)           COMMENT 'NULL nếu đăng nhập Google',
                      full_name      VARCHAR(200),
                      phone          VARCHAR(20),
                      auth_provider  ENUM('LOCAL','GOOGLE') NOT NULL DEFAULT 'LOCAL',
                      google_id      VARCHAR(200) UNIQUE    COMMENT 'Sub từ Google OAuth',
                      role           ENUM('CUSTOMER','ADMIN','STAFF') NOT NULL DEFAULT 'CUSTOMER',
                      loyalty_points INT NOT NULL DEFAULT 0,
                      is_active      TINYINT(1) NOT NULL DEFAULT 1,
                      created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 10. USER_ADDRESS (Địa chỉ giao hàng đã lưu)
-- ------------------------------------------------------------
CREATE TABLE user_address (
                              id              INT AUTO_INCREMENT PRIMARY KEY,
                              user_id         INT NOT NULL,
                              recipient_name  VARCHAR(200) NOT NULL,
                              phone           VARCHAR(20)  NOT NULL,
                              address_detail  TEXT         NOT NULL COMMENT 'Số nhà, tên đường',
                              province        VARCHAR(100) NOT NULL,
                              district        VARCHAR(100) NOT NULL,
                              ward            VARCHAR(100) NOT NULL,
                              is_default      TINYINT(1) NOT NULL DEFAULT 0,
                              CONSTRAINT fk_ua_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 12. CART (Giỏ hàng — hỗ trợ cả guest lẫn user)
-- ------------------------------------------------------------
CREATE TABLE cart (
                      id         INT AUTO_INCREMENT PRIMARY KEY,
                      user_id    INT DEFAULT NULL     COMMENT 'NULL nếu là guest',
                      session_id VARCHAR(128) DEFAULT NULL COMMENT 'Session ID cho guest',
                      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                      CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cart_item (
                           id               INT AUTO_INCREMENT PRIMARY KEY,
                           cart_id          INT NOT NULL,
                           watch_variant_id INT NOT NULL,
                           quantity         INT NOT NULL DEFAULT 1,
                           unit_price       DECIMAL(15,0) NOT NULL COMMENT 'Giá tại thời điểm thêm vào giỏ',
                           CONSTRAINT fk_ci_cart    FOREIGN KEY (cart_id)          REFERENCES cart(id)          ON DELETE CASCADE,
                           CONSTRAINT fk_ci_variant FOREIGN KEY (watch_variant_id) REFERENCES watch_variant(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 13. PROMOTION (Chương trình khuyến mãi)
--    promo_type: EVENT | LOYALTY_PURCHASE_COUNT | SLOW_MOVING_STOCK
--    discount_type: PERCENT | FIXED_AMOUNT
-- ------------------------------------------------------------
CREATE TABLE promotion (
                           id                   INT AUTO_INCREMENT PRIMARY KEY,
                           name                 VARCHAR(255) NOT NULL,
                           promo_type           ENUM('EVENT','LOYALTY_PURCHASE_COUNT','SLOW_MOVING_STOCK') NOT NULL,
                           discount_type        ENUM('PERCENT','FIXED_AMOUNT') NOT NULL,
                           discount_value       DECIMAL(10,2) NOT NULL,
                           min_order_value      DECIMAL(15,0) NOT NULL DEFAULT 0,
                           max_discount_amount  DECIMAL(15,0)          COMMENT 'Giảm tối đa (cho loại PERCENT)',
                           max_uses             INT                    COMMENT 'Tổng lượt dùng tối đa',
                           used_count           INT NOT NULL DEFAULT 0,
                           min_purchase_count   INT NOT NULL DEFAULT 0 COMMENT 'Số lần mua tối thiểu (loyalty)',
                           watch_variant_id     INT DEFAULT NULL       COMMENT 'Áp dụng riêng biến thể (slow-moving)',
                           applies_to_all       TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'Áp dụng toàn đơn',
                           start_date           DATETIME NOT NULL,
                           end_date             DATETIME NOT NULL,
                           is_active            TINYINT(1) NOT NULL DEFAULT 1,
                           created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_promo_variant FOREIGN KEY (watch_variant_id) REFERENCES watch_variant(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 14. COUPON (Mã giảm giá phát sinh từ promotion)
-- ------------------------------------------------------------
CREATE TABLE coupon (
                        id           INT AUTO_INCREMENT PRIMARY KEY,
                        promotion_id INT NOT NULL,
                        code         VARCHAR(50) NOT NULL UNIQUE,
                        user_id      INT DEFAULT NULL COMMENT 'NULL = dùng chung, có giá trị = riêng user đó',
                        is_used      TINYINT(1) NOT NULL DEFAULT 0,
                        used_at      TIMESTAMP DEFAULT NULL,
                        expires_at   DATETIME DEFAULT NULL,
                        CONSTRAINT fk_cp_promotion FOREIGN KEY (promotion_id) REFERENCES promotion(id),
                        CONSTRAINT fk_cp_user      FOREIGN KEY (user_id)      REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 15. SHIPPER (Đơn vị vận chuyển bên ngoài: GHTK, GHN...)
-- ------------------------------------------------------------
CREATE TABLE shipper (
                         id           INT AUTO_INCREMENT PRIMARY KEY,
                         name         VARCHAR(100) NOT NULL,
                         api_endpoint VARCHAR(500),
                         api_key      VARCHAR(500),
                         is_active    TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 15. ORDER (Đơn hàng)
--    payment_method: COD | VNPAY | BANK_TRANSFER | MOMO
--    payment_status: UNPAID | PENDING | PAID | FAILED | REFUNDED
--    order_status:   PENDING | CONFIRMED | PROCESSING | SHIPPING | DELIVERED | CANCELLED | RETURNED
--    delivery_method: EXTERNAL_SHIPPER | DIRECT_SHOP
-- ------------------------------------------------------------
CREATE TABLE `order` (
                         id                       INT AUTO_INCREMENT PRIMARY KEY,
                         order_code               VARCHAR(30) NOT NULL UNIQUE,
                         user_id                  INT DEFAULT NULL      COMMENT 'NULL nếu guest',
                         guest_email              VARCHAR(150)          COMMENT 'Dùng khi guest đặt hàng',
                         guest_phone              VARCHAR(20),
                         guest_name               VARCHAR(200),
                         address_id               INT DEFAULT NULL      COMMENT 'Địa chỉ đã lưu (nếu có TK)',
                         shipping_address_snapshot TEXT NOT NULL        COMMENT 'Snapshot địa chỉ lúc đặt hàng',
                         subtotal                 DECIMAL(15,0) NOT NULL,
                         discount_amount          DECIMAL(15,0) NOT NULL DEFAULT 0,
                         shipping_fee             DECIMAL(15,0) NOT NULL DEFAULT 0,
                         total_amount             DECIMAL(15,0) NOT NULL,
                         coupon_id                INT DEFAULT NULL,
                         payment_method           ENUM('COD','VNPAY','BANK_TRANSFER','MOMO') NOT NULL,
                         payment_status           ENUM('UNPAID','PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
                         order_status             ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPING','DELIVERED','CANCELLED','RETURNED') NOT NULL DEFAULT 'PENDING',
                         delivery_method          ENUM('EXTERNAL_SHIPPER','DIRECT_SHOP') NOT NULL,
                         tracking_code            VARCHAR(100)          COMMENT 'Mã vận đơn GHTK/GHN',
                         shipper_id               INT DEFAULT NULL      COMMENT 'Đơn vị giao hàng bên ngoài',
                         note                     TEXT,
                         created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         updated_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         CONSTRAINT fk_ord_user    FOREIGN KEY (user_id)   REFERENCES user(id) ON DELETE SET NULL,
                         CONSTRAINT fk_ord_address FOREIGN KEY (address_id) REFERENCES user_address(id) ON DELETE SET NULL,
                         CONSTRAINT fk_ord_coupon  FOREIGN KEY (coupon_id)  REFERENCES coupon(id) ON DELETE SET NULL,
                         CONSTRAINT fk_ord_shipper FOREIGN KEY (shipper_id) REFERENCES shipper(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 16. ORDER_ITEM (Chi tiết đơn hàng)
-- ------------------------------------------------------------
CREATE TABLE order_item (
                            id                INT AUTO_INCREMENT PRIMARY KEY,
                            order_id          INT NOT NULL,
                            watch_variant_id  INT NOT NULL,
                            product_snapshot  JSON NOT NULL COMMENT 'Snapshot: tên, ảnh, màu, size tại thời điểm mua',
                            quantity          INT NOT NULL,
                            unit_price        DECIMAL(15,0) NOT NULL,
                            total_price       DECIMAL(15,0) NOT NULL,
                            CONSTRAINT fk_oi_order   FOREIGN KEY (order_id)         REFERENCES `order`(id) ON DELETE CASCADE,
                            CONSTRAINT fk_oi_variant FOREIGN KEY (watch_variant_id) REFERENCES watch_variant(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 17. ORDER_STATUS_HISTORY (Lịch sử trạng thái đơn)
-- ------------------------------------------------------------
CREATE TABLE order_status_history (
                                      id          INT AUTO_INCREMENT PRIMARY KEY,
                                      order_id    INT NOT NULL,
                                      status      ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPING','DELIVERED','CANCELLED','RETURNED') NOT NULL,
                                      note        VARCHAR(500),
                                      changed_by  INT DEFAULT NULL COMMENT 'user.id của admin/staff thực hiện',
                                      changed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      CONSTRAINT fk_osh_order FOREIGN KEY (order_id)   REFERENCES `order`(id) ON DELETE CASCADE,
                                      CONSTRAINT fk_osh_user  FOREIGN KEY (changed_by) REFERENCES user(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 18. PAYMENT_TRANSACTION (Giao dịch thanh toán VNPay / COD)
--    gateway: VNPAY | COD | BANK_TRANSFER
--    status: PENDING | COMPLETED | FAILED | REFUNDED
-- ------------------------------------------------------------
CREATE TABLE payment_transaction (
                                     id               INT AUTO_INCREMENT PRIMARY KEY,
                                     order_id         INT NOT NULL,
                                     transaction_code VARCHAR(100) UNIQUE COMMENT 'Mã giao dịch từ cổng thanh toán',
                                     gateway          ENUM('VNPAY','COD','BANK_TRANSFER') NOT NULL,
                                     amount           DECIMAL(15,0) NOT NULL,
                                     status           ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
                                     response_data    JSON COMMENT 'Raw response từ VNPay IPN',
                                     created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                     updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                     CONSTRAINT fk_pt_order FOREIGN KEY (order_id) REFERENCES `order`(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 19. RETURN_REQUEST (Yêu cầu đổi trả)
--    status: PENDING | APPROVED | REJECTED | COMPLETED
--    refund_method: COD_REFUND | VNPAY_REFUND | STORE_CREDIT
-- ------------------------------------------------------------
CREATE TABLE return_request (
                                id            INT AUTO_INCREMENT PRIMARY KEY,
                                order_id      INT NOT NULL,
                                user_id       INT NOT NULL,
                                reason        TEXT NOT NULL,
                                status        ENUM('PENDING','APPROVED','REJECTED','COMPLETED') NOT NULL DEFAULT 'PENDING',
                                refund_method ENUM('COD_REFUND','VNPAY_REFUND','STORE_CREDIT') DEFAULT NULL,
                                refund_amount DECIMAL(15,0) DEFAULT NULL,
                                admin_note    TEXT,
                                created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                CONSTRAINT fk_rr_order FOREIGN KEY (order_id) REFERENCES `order`(id),
                                CONSTRAINT fk_rr_user  FOREIGN KEY (user_id)  REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE return_item (
                             id             INT AUTO_INCREMENT PRIMARY KEY,
                             return_id      INT NOT NULL,
                             order_item_id  INT NOT NULL,
                             quantity       INT NOT NULL,
                             condition_note TEXT COMMENT 'Tình trạng sản phẩm trả về',
                             CONSTRAINT fk_ri_return    FOREIGN KEY (return_id)     REFERENCES return_request(id) ON DELETE CASCADE,
                             CONSTRAINT fk_ri_orderitem FOREIGN KEY (order_item_id) REFERENCES order_item(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 20. WISHLIST (Danh sách yêu thích)
-- ------------------------------------------------------------
CREATE TABLE wishlist (
                          id               INT AUTO_INCREMENT PRIMARY KEY,
                          user_id          INT NOT NULL,
                          watch_variant_id INT NOT NULL,
                          added_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          UNIQUE KEY uq_wishlist (user_id, watch_variant_id),
                          CONSTRAINT fk_wl_user    FOREIGN KEY (user_id)          REFERENCES user(id)          ON DELETE CASCADE,
                          CONSTRAINT fk_wl_variant FOREIGN KEY (watch_variant_id) REFERENCES watch_variant(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 21. REVIEW (Đánh giá sản phẩm)
-- ------------------------------------------------------------
CREATE TABLE review (
                        id          INT AUTO_INCREMENT PRIMARY KEY,
                        user_id     INT NOT NULL,
                        watch_id    INT NOT NULL,
                        order_id    INT NOT NULL COMMENT 'Chỉ review sau khi đã mua',
                        rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
                        comment     TEXT,
                        is_approved TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'Admin duyệt trước khi hiển thị',
                        created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UNIQUE KEY uq_review (user_id, watch_id, order_id),
                        CONSTRAINT fk_rv_user  FOREIGN KEY (user_id)  REFERENCES user(id),
                        CONSTRAINT fk_rv_watch FOREIGN KEY (watch_id) REFERENCES watch(id),
                        CONSTRAINT fk_rv_order FOREIGN KEY (order_id) REFERENCES `order`(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 22. IMPORT_RECEIPT (Phiếu nhập kho)
--    status: DRAFT | APPROVED | CANCELLED
-- ------------------------------------------------------------
CREATE TABLE import_receipt (
                                id           INT AUTO_INCREMENT PRIMARY KEY,
                                receipt_code VARCHAR(30) NOT NULL UNIQUE,
                                supplier_id  INT NOT NULL,
                                created_by   INT NOT NULL COMMENT 'admin/staff tạo phiếu',
                                total_amount DECIMAL(15,0) NOT NULL DEFAULT 0,
                                status       ENUM('DRAFT','APPROVED','CANCELLED') NOT NULL DEFAULT 'DRAFT',
                                note         TEXT,
                                import_date  DATE NOT NULL,
                                created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                updated_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                CONSTRAINT fk_ir_supplier FOREIGN KEY (supplier_id) REFERENCES supplier(id),
                                CONSTRAINT fk_ir_creator  FOREIGN KEY (created_by)  REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE import_receipt_item (
                                     id               INT AUTO_INCREMENT PRIMARY KEY,
                                     receipt_id       INT NOT NULL,
                                     watch_variant_id INT NOT NULL,
                                     quantity         INT NOT NULL,
                                     unit_cost        DECIMAL(15,0) NOT NULL COMMENT 'Giá nhập / đơn vị',
                                     total_cost       DECIMAL(15,0) NOT NULL COMMENT 'quantity × unit_cost',
                                     batch_number     VARCHAR(50)   COMMENT 'Số lô hàng',
                                     expiry_date      DATE          COMMENT 'Hạn bảo hành / hạn dùng nếu có',
                                     CONSTRAINT fk_iri_receipt FOREIGN KEY (receipt_id)       REFERENCES import_receipt(id) ON DELETE CASCADE,
                                     CONSTRAINT fk_iri_variant FOREIGN KEY (watch_variant_id) REFERENCES watch_variant(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 23. ADMIN_LOG (Audit log hành động của admin/staff)
-- ------------------------------------------------------------
CREATE TABLE admin_log (
                           id         INT AUTO_INCREMENT PRIMARY KEY,
                           admin_id   INT NOT NULL,
                           action     VARCHAR(100) NOT NULL COMMENT 'CREATE | UPDATE | DELETE | APPROVE...',
                           table_name VARCHAR(100) NOT NULL,
                           record_id  INT,
                           old_value  JSON COMMENT 'Giá trị trước khi thay đổi',
                           new_value  JSON COMMENT 'Giá trị sau khi thay đổi',
                           ip_address VARCHAR(45),
                           created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                           CONSTRAINT fk_al_admin FOREIGN KEY (admin_id) REFERENCES user(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INDEXES (Tối ưu truy vấn phổ biến)
-- ============================================================
CREATE INDEX idx_watch_brand      ON watch(brand_id);
CREATE INDEX idx_watch_segment    ON watch(segment_id);
CREATE INDEX idx_watch_category   ON watch(category_id);
CREATE INDEX idx_watch_variant    ON watch_variant(watch_id);
CREATE INDEX idx_order_user       ON `order`(user_id);
CREATE INDEX idx_order_status     ON `order`(order_status);
CREATE INDEX idx_order_created    ON `order`(created_at);
CREATE INDEX idx_coupon_code      ON coupon(code);
CREATE INDEX idx_promotion_dates  ON promotion(start_date, end_date);
CREATE INDEX idx_review_watch     ON review(watch_id);
CREATE INDEX idx_import_supplier  ON import_receipt(supplier_id);
CREATE INDEX idx_cart_session     ON cart(session_id);
CREATE INDEX idx_admin_log_admin  ON admin_log(admin_id, created_at);

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- THÊM VÀO BẢNG user
-- ------------------------------------------------------------
ALTER TABLE user
    ADD COLUMN is_verified TINYINT(1) NOT NULL DEFAULT 0
    COMMENT 'Email đã xác thực OTP chưa'
  AFTER is_active;

-- ------------------------------------------------------------
-- BẢNG MỚI 1: otp_verification
-- purpose: REGISTER | GOOGLE_VERIFY | FORGOT_PASSWORD
-- ------------------------------------------------------------
CREATE TABLE otp_verification (
                                  id          INT AUTO_INCREMENT PRIMARY KEY,
                                  email       VARCHAR(150) NOT NULL,
                                  otp_code    VARCHAR(10)  NOT NULL        COMMENT 'Mã OTP 6 số',
                                  purpose     ENUM('REGISTER','GOOGLE_VERIFY','FORGOT_PASSWORD') NOT NULL,
                                  is_used     TINYINT(1)   NOT NULL DEFAULT 0,
                                  attempts    TINYINT      NOT NULL DEFAULT 0 COMMENT 'Số lần nhập sai, tối đa 5',
                                  expires_at  DATETIME     NOT NULL,
                                  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  INDEX idx_otp_email   (email),
                                  INDEX idx_otp_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- BẢNG MỚI 2: refresh_token
-- ------------------------------------------------------------
CREATE TABLE refresh_token (
                               id           INT AUTO_INCREMENT PRIMARY KEY,
                               user_id      INT          NOT NULL,
                               token_hash   VARCHAR(255) NOT NULL UNIQUE COMMENT 'SHA-256 của token thực',
                               device_info  VARCHAR(255)           COMMENT 'User-Agent / tên thiết bị',
                               ip_address   VARCHAR(45),
                               is_revoked   TINYINT(1)   NOT NULL DEFAULT 0,
                               expires_at   DATETIME     NOT NULL,
                               created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               last_used_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                               CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                               INDEX idx_rt_user    (user_id),
                               INDEX idx_rt_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
use TAwatch;
alter table user
    add column birthday date
    after phone