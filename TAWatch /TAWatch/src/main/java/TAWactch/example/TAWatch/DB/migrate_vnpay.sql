-- ============================================================
-- MIGRATION: Sync ENUM values với Java code
-- Chạy file này trên DB đang có sẵn (không cần xóa/tạo lại)
-- ============================================================
USE TAwatch;

-- 1. order.payment_method: thêm BANK_TRANSFER, MOMO
ALTER TABLE `order`
    MODIFY COLUMN payment_method ENUM('COD','VNPAY','BANK_TRANSFER','MOMO') NOT NULL;

-- 2. order.payment_status: thêm UNPAID
ALTER TABLE `order`
    MODIFY COLUMN payment_status ENUM('UNPAID','PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING';

-- 3. payment_transaction.gateway: thêm BANK_TRANSFER
ALTER TABLE payment_transaction
    MODIFY COLUMN gateway ENUM('VNPAY','COD','BANK_TRANSFER') NOT NULL;

-- 4. payment_transaction.status: đổi SUCCESS -> COMPLETED (theo Java code)
--    Cập nhật dữ liệu cũ nếu có trước khi đổi ENUM
UPDATE payment_transaction SET status = 'COMPLETED' WHERE status = 'SUCCESS';
ALTER TABLE payment_transaction
    MODIFY COLUMN status ENUM('PENDING','COMPLETED','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING';
