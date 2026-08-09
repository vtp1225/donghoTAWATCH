-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: TAwatch
-- ------------------------------------------------------
-- Server version	8.0.36
create database	Tawatch;
use Tawatch;
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_log`
--

DROP TABLE IF EXISTS `admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_log` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `admin_id` int NOT NULL,
                             `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'CREATE | UPDATE | DELETE | APPROVE...',
                             `table_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `record_id` int DEFAULT NULL,
                             `old_value` json DEFAULT NULL COMMENT 'Giá trị trước khi thay đổi',
                             `new_value` json DEFAULT NULL COMMENT 'Giá trị sau khi thay đổi',
                             `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                             `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             PRIMARY KEY (`id`),
                             KEY `idx_admin_log_admin` (`admin_id`,`created_at`),
                             CONSTRAINT `fk_al_admin` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_log`
--

LOCK TABLES `admin_log` WRITE;
/*!40000 ALTER TABLE `admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brand`
--

DROP TABLE IF EXISTS `brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brand` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `description` text COLLATE utf8mb4_unicode_ci,
                         `logo_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `is_active` tinyint(1) NOT NULL DEFAULT '1',
                         `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Rolex','Thụy Sĩ','Thương hiệu đồng hồ luxury nổi tiếng',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10'),(2,'Casio','Nhật Bản','Đồng hồ điện tử và quartz phổ biến',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10'),(3,'Omega','Thụy Sĩ','Thương hiệu đồng hồ cao cấp',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10'),(4,'Apple','Mỹ','Đồng hồ thông minh Apple Watch',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10');
/*!40000 ALTER TABLE `brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
                        `id` int NOT NULL AUTO_INCREMENT,
                        `user_id` int DEFAULT NULL COMMENT 'NULL nếu là guest',
                        `session_id` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Session ID cho guest',
                        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (`id`),
                        KEY `fk_cart_user` (`user_id`),
                        KEY `idx_cart_session` (`session_id`),
                        CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,NULL,'guest-ef641e12-ec0c-4186-beca-09d83f4078eb','2026-05-27 08:37:23','2026-05-29 12:51:48'),(4,4,NULL,'2026-05-27 11:29:28','2026-05-27 11:29:48'),(5,5,NULL,'2026-05-27 11:35:03','2026-05-27 11:35:03'),(6,6,NULL,'2026-05-27 11:40:00','2026-05-27 11:40:00'),(7,7,NULL,'2026-05-27 11:41:26','2026-05-27 11:41:26'),(8,9,NULL,'2026-05-27 11:45:02','2026-05-27 11:45:02'),(9,11,NULL,'2026-05-27 11:45:19','2026-05-27 11:45:19'),(10,12,NULL,'2026-05-27 11:45:31','2026-05-27 11:45:31'),(11,13,NULL,'2026-05-27 11:46:19','2026-05-27 11:46:19'),(14,16,NULL,'2026-05-27 12:13:16','2026-05-27 12:13:16'),(19,22,NULL,'2026-05-27 14:28:15','2026-05-27 14:28:15'),(20,23,NULL,'2026-05-27 14:39:05','2026-05-28 06:20:55'),(21,24,NULL,'2026-05-28 15:08:35','2026-05-28 15:08:35'),(22,1,NULL,'2026-05-29 12:50:30','2026-05-29 12:50:30');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_item`
--

DROP TABLE IF EXISTS `cart_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_item` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `cart_id` int NOT NULL,
                             `watch_variant_id` int NOT NULL,
                             `quantity` int NOT NULL DEFAULT '1',
                             `unit_price` decimal(15,0) NOT NULL COMMENT 'Giá tại thời điểm thêm vào giỏ',
                             PRIMARY KEY (`id`),
                             KEY `fk_ci_cart` (`cart_id`),
                             KEY `fk_ci_variant` (`watch_variant_id`),
                             CONSTRAINT `fk_ci_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`id`) ON DELETE CASCADE,
                             CONSTRAINT `fk_ci_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (5,4,4,1,180000000),(6,20,1,1,320000000),(7,1,5,1,12990000),(8,20,5,1,12990000),(9,1,1,1,320000000);
/*!40000 ALTER TABLE `cart_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                            `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                            `parent_id` int DEFAULT NULL,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `slug` (`slug`),
                            KEY `fk_cat_parent` (`parent_id`),
                            CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Đồng hồ nam','dong-ho-nam',NULL),(2,'Đồng hồ nữ','dong-ho-nu',NULL),(3,'Đồng hồ đôi','dong-ho-doi',NULL),(4,'Smart Watch','smart-watch',NULL),(5,'Automatic Nam','automatic-nam',1),(6,'Quartz Nam','quartz-nam',1),(7,'Luxury Nam','luxury-nam',1),(8,'Automatic Nữ','automatic-nu',2),(9,'Quartz Nữ','quartz-nu',2),(10,'Luxury Nữ','luxury-nu',2),(11,'Apple Watch','apple-watch',4),(12,'Samsung Watch','samsung-watch',4),(13,'Garmin Watch','garmin-watch',4);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS `color`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `color` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên màu',
                         `hex_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã màu HEX, ví dụ #000000',
                         `is_active` tinyint(1) NOT NULL DEFAULT '1',
                         `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES (1,'Đen','#000000',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(2,'Trắng','#FFFFFF',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(3,'Xanh dương','#0000FF',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(4,'Đỏ','#FF0000',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(5,'Bạc','#C0C0C0',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(6,'Vàng','#FFD700',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(7,'Nâu','#8B4513',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(8,'Xám','#808080',1,'2026-05-27 08:33:39','2026-05-27 08:33:39');
/*!40000 ALTER TABLE `color` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `promotion_id` int NOT NULL,
                          `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                          `user_id` int DEFAULT NULL COMMENT 'NULL = dùng chung, có giá trị = riêng user đó',
                          `is_used` tinyint(1) NOT NULL DEFAULT '0',
                          `used_at` timestamp NULL DEFAULT NULL,
                          `expires_at` datetime DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `code` (`code`),
                          KEY `fk_cp_promotion` (`promotion_id`),
                          KEY `fk_cp_user` (`user_id`),
                          KEY `idx_coupon_code` (`code`),
                          CONSTRAINT `fk_cp_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`),
                          CONSTRAINT `fk_cp_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipt`
--

DROP TABLE IF EXISTS `import_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipt` (
                                  `id` int NOT NULL AUTO_INCREMENT,
                                  `receipt_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
                                  `supplier_id` int NOT NULL,
                                  `created_by` int NOT NULL COMMENT 'admin/staff tạo phiếu',
                                  `total_amount` decimal(15,0) NOT NULL DEFAULT '0',
                                  `status` enum('DRAFT','APPROVED','CANCELLED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'DRAFT',
                                  `note` text COLLATE utf8mb4_unicode_ci,
                                  `import_date` date NOT NULL,
                                  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  PRIMARY KEY (`id`),
                                  UNIQUE KEY `receipt_code` (`receipt_code`),
                                  KEY `fk_ir_creator` (`created_by`),
                                  KEY `idx_import_supplier` (`supplier_id`),
                                  CONSTRAINT `fk_ir_creator` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
                                  CONSTRAINT `fk_ir_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt`
--

LOCK TABLES `import_receipt` WRITE;
/*!40000 ALTER TABLE `import_receipt` DISABLE KEYS */;
/*!40000 ALTER TABLE `import_receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `import_receipt_item`
--

DROP TABLE IF EXISTS `import_receipt_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `import_receipt_item` (
                                       `id` int NOT NULL AUTO_INCREMENT,
                                       `receipt_id` int NOT NULL,
                                       `watch_variant_id` int NOT NULL,
                                       `quantity` int NOT NULL,
                                       `unit_cost` decimal(15,0) NOT NULL COMMENT 'Giá nhập / đơn vị',
                                       `total_cost` decimal(15,0) NOT NULL COMMENT 'quantity × unit_cost',
                                       `batch_number` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Số lô hàng',
                                       `expiry_date` date DEFAULT NULL COMMENT 'Hạn bảo hành / hạn dùng nếu có',
                                       PRIMARY KEY (`id`),
                                       KEY `fk_iri_receipt` (`receipt_id`),
                                       KEY `fk_iri_variant` (`watch_variant_id`),
                                       CONSTRAINT `fk_iri_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `import_receipt` (`id`) ON DELETE CASCADE,
                                       CONSTRAINT `fk_iri_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt_item`
--

LOCK TABLES `import_receipt_item` WRITE;
/*!40000 ALTER TABLE `import_receipt_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `import_receipt_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `order_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `user_id` int DEFAULT NULL COMMENT 'NULL nếu guest',
                         `guest_email` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Dùng khi guest đặt hàng',
                         `guest_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `guest_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                         `address_id` int DEFAULT NULL COMMENT 'Địa chỉ đã lưu (nếu có TK)',
                         `shipping_address_snapshot` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Snapshot địa chỉ lúc đặt hàng',
                         `subtotal` decimal(15,0) NOT NULL,
                         `discount_amount` decimal(15,0) NOT NULL DEFAULT '0',
                         `shipping_fee` decimal(15,0) NOT NULL DEFAULT '0',
                         `total_amount` decimal(15,0) NOT NULL,
                         `coupon_id` int DEFAULT NULL,
                         `payment_method` enum('COD','VNPAY','BANK_TRANSFER','MOMO') COLLATE utf8mb4_unicode_ci NOT NULL,
                         `payment_status` enum('UNPAID','PENDING','PAID','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
                         `order_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `delivery_method` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `tracking_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã vận đơn GHTK/GHN',
                         `shipper_id` int DEFAULT NULL COMMENT 'Đơn vị giao hàng bên ngoài',
                         `note` text COLLATE utf8mb4_unicode_ci,
                         `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `order_code` (`order_code`),
                         KEY `fk_ord_address` (`address_id`),
                         KEY `fk_ord_coupon` (`coupon_id`),
                         KEY `fk_ord_shipper` (`shipper_id`),
                         KEY `idx_order_user` (`user_id`),
                         KEY `idx_order_status` (`order_status`),
                         KEY `idx_order_created` (`created_at`),
                         CONSTRAINT `fk_ord_address` FOREIGN KEY (`address_id`) REFERENCES `user_address` (`id`) ON DELETE SET NULL,
                         CONSTRAINT `fk_ord_coupon` FOREIGN KEY (`coupon_id`) REFERENCES `coupon` (`id`) ON DELETE SET NULL,
                         CONSTRAINT `fk_ord_shipper` FOREIGN KEY (`shipper_id`) REFERENCES `shipper` (`id`) ON DELETE SET NULL,
                         CONSTRAINT `fk_ord_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (1,'ORD-20260528-769059',23,NULL,NULL,NULL,2,'{\"recipientName\":\"Vo THien Phu\",\"phone\":\"012356789\",\"addressDetail\":\"213/10\",\"ward\":\"Hiep Phước\",\"district\":\"Nhà Bè\",\"province\":\"HCM\"}',320000000,0,0,320000000,NULL,'COD','UNPAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-05-28 05:22:49','2026-05-28 15:17:47'),(2,'ORD-20260528-784353',23,NULL,NULL,NULL,2,'{\"recipientName\":\"Vo THien Phu\",\"phone\":\"012356789\",\"addressDetail\":\"213/10\",\"ward\":\"Hiep Phước\",\"district\":\"Nhà Bè\",\"province\":\"HCM\"}',320000000,0,0,320000000,NULL,'MOMO','UNPAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-05-28 05:23:04','2026-05-28 10:24:54');
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_item`
--

DROP TABLE IF EXISTS `order_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_item` (
                              `id` int NOT NULL AUTO_INCREMENT,
                              `order_id` int NOT NULL,
                              `watch_variant_id` int NOT NULL,
                              `product_snapshot` json NOT NULL COMMENT 'Snapshot: tên, ảnh, màu, size tại thời điểm mua',
                              `quantity` int NOT NULL,
                              `unit_price` decimal(15,0) NOT NULL,
                              `total_price` decimal(15,0) NOT NULL,
                              PRIMARY KEY (`id`),
                              KEY `fk_oi_order` (`order_id`),
                              KEY `fk_oi_variant` (`watch_variant_id`),
                              CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
                              CONSTRAINT `fk_oi_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (1,1,1,'{\"sku\": \"RLX-SUB-001\", \"name\": \"Rolex Submariner Date\", \"brand\": \"Rolex\", \"price\": 320000000, \"watchId\": 1, \"imageUrl\": \"https://example.com/rolex-sub-black.jpg\", \"dialColor\": null, \"variantId\": 1, \"caseSizeMm\": 41.0, \"strapColor\": null, \"strapMaterial\": \"Thép không gỉ\"}',1,320000000,320000000),(2,2,1,'{\"sku\": \"RLX-SUB-001\", \"name\": \"Rolex Submariner Date\", \"brand\": \"Rolex\", \"price\": 320000000, \"watchId\": 1, \"imageUrl\": \"https://example.com/rolex-sub-black.jpg\", \"dialColor\": null, \"variantId\": 1, \"caseSizeMm\": 41.0, \"strapColor\": null, \"strapMaterial\": \"Thép không gỉ\"}',1,320000000,320000000);
/*!40000 ALTER TABLE `order_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
                                        `id` int NOT NULL AUTO_INCREMENT,
                                        `order_id` int NOT NULL,
                                        `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                                        `note` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                        `changed_by` int DEFAULT NULL COMMENT 'user.id của admin/staff thực hiện',
                                        `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                        PRIMARY KEY (`id`),
                                        KEY `fk_osh_order` (`order_id`),
                                        KEY `fk_osh_user` (`changed_by`),
                                        CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
                                        CONSTRAINT `fk_osh_user` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (1,1,'PENDING','Don hang moi duoc tao',NULL,'2026-05-28 05:22:49'),(2,2,'PENDING','Don hang moi duoc tao',NULL,'2026-05-28 05:23:04'),(3,2,'CONFIRMED',NULL,NULL,'2026-05-28 06:33:28'),(4,1,'CONFIRMED',NULL,NULL,'2026-05-28 06:33:29'),(5,2,'PROCESSING',NULL,NULL,'2026-05-28 06:33:35'),(6,1,'PROCESSING',NULL,NULL,'2026-05-28 06:33:36'),(7,2,'SHIPPING',NULL,NULL,'2026-05-28 10:24:45'),(8,2,'DELIVERED',NULL,NULL,'2026-05-28 10:24:54'),(9,1,'SHIPPING',NULL,NULL,'2026-05-28 15:17:45'),(10,1,'DELIVERED',NULL,NULL,'2026-05-28 15:17:47');
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_verification`
--

DROP TABLE IF EXISTS `otp_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_verification` (
                                    `id` int NOT NULL AUTO_INCREMENT,
                                    `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                                    `otp_code` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã OTP 6 số',
                                    `purpose` enum('VERIFY_EMAIL','RESET_PASSWORD','CHANGE_EMAIL') COLLATE utf8mb4_unicode_ci NOT NULL,
                                    `is_used` tinyint(1) NOT NULL DEFAULT '0',
                                    `attempts` tinyint NOT NULL DEFAULT '0' COMMENT 'Số lần nhập sai, tối đa 5',
                                    `expires_at` datetime NOT NULL,
                                    `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                    PRIMARY KEY (`id`),
                                    KEY `idx_otp_email` (`email`),
                                    KEY `idx_otp_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verification`
--

LOCK TABLES `otp_verification` WRITE;
/*!40000 ALTER TABLE `otp_verification` DISABLE KEYS */;
INSERT INTO `otp_verification` VALUES (1,'anhtuhungdeveloper@gmail.com','331804','VERIFY_EMAIL',0,0,'2026-05-27 14:14:48','2026-05-27 14:09:48'),(2,'quyvo2079@gmail.com','653599','VERIFY_EMAIL',1,0,'2026-05-27 14:17:10','2026-05-27 14:12:10'),(3,'quyvo2079@gmail.com','017714','VERIFY_EMAIL',1,0,'2026-05-27 14:19:38','2026-05-27 14:14:38'),(4,'quyvo2079@gmail.com','869921','VERIFY_EMAIL',1,0,'2026-05-27 14:23:35','2026-05-27 14:18:35'),(5,'quyvo2079@gmail.com','171566','VERIFY_EMAIL',1,0,'2026-05-27 14:31:18','2026-05-27 14:26:18'),(6,'vothienphu113@gmail.com','113074','VERIFY_EMAIL',0,0,'2026-05-27 14:33:15','2026-05-27 14:28:15'),(7,'quyvo2079@gmail.com','229881','VERIFY_EMAIL',1,0,'2026-05-27 14:44:05','2026-05-27 14:39:05');
/*!40000 ALTER TABLE `otp_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transaction`
--

DROP TABLE IF EXISTS `payment_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transaction` (
                                       `id` int NOT NULL AUTO_INCREMENT,
                                       `order_id` int NOT NULL,
                                       `transaction_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã giao dịch từ cổng thanh toán',
                                       `gateway` enum('VNPAY','COD','BANK_TRANSFER') COLLATE utf8mb4_unicode_ci NOT NULL,
                                       `amount` decimal(15,0) NOT NULL,
                                       `status` enum('PENDING','COMPLETED','FAILED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
                                       `response_data` json DEFAULT NULL COMMENT 'Raw response từ VNPay IPN',
                                       `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                       `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                       PRIMARY KEY (`id`),
                                       UNIQUE KEY `transaction_code` (`transaction_code`),
                                       KEY `fk_pt_order` (`order_id`),
                                       CONSTRAINT `fk_pt_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transaction`
--

LOCK TABLES `payment_transaction` WRITE;
/*!40000 ALTER TABLE `payment_transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
                             `id` int NOT NULL AUTO_INCREMENT,
                             `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                             `promo_type` enum('EVENT','LOYALTY_PURCHASE_COUNT','SLOW_MOVING_STOCK') COLLATE utf8mb4_unicode_ci NOT NULL,
                             `discount_type` enum('PERCENT','FIXED_AMOUNT') COLLATE utf8mb4_unicode_ci NOT NULL,
                             `discount_value` decimal(10,2) NOT NULL,
                             `min_order_value` decimal(15,0) NOT NULL DEFAULT '0',
                             `max_discount_amount` decimal(15,0) DEFAULT NULL COMMENT 'Giảm tối đa (cho loại PERCENT)',
                             `max_uses` int DEFAULT NULL COMMENT 'Tổng lượt dùng tối đa',
                             `used_count` int NOT NULL DEFAULT '0',
                             `min_purchase_count` int NOT NULL DEFAULT '0' COMMENT 'Số lần mua tối thiểu (loyalty)',
                             `watch_variant_id` int DEFAULT NULL COMMENT 'Áp dụng riêng biến thể (slow-moving)',
                             `applies_to_all` tinyint(1) NOT NULL DEFAULT '1' COMMENT 'Áp dụng toàn đơn',
                             `start_date` datetime NOT NULL,
                             `end_date` datetime NOT NULL,
                             `is_active` tinyint(1) NOT NULL DEFAULT '1',
                             `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                             PRIMARY KEY (`id`),
                             KEY `fk_promo_variant` (`watch_variant_id`),
                             KEY `idx_promotion_dates` (`start_date`,`end_date`),
                             CONSTRAINT `fk_promo_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
                                 `id` int NOT NULL AUTO_INCREMENT,
                                 `user_id` int NOT NULL,
                                 `token_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA-256 của token thực',
                                 `device_info` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'User-Agent / tên thiết bị',
                                 `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                 `is_revoked` tinyint(1) NOT NULL DEFAULT '0',
                                 `expires_at` datetime NOT NULL,
                                 `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 `last_used_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                 PRIMARY KEY (`id`),
                                 UNIQUE KEY `token_hash` (`token_hash`),
                                 KEY `idx_rt_user` (`user_id`),
                                 KEY `idx_rt_expires` (`expires_at`),
                                 CONSTRAINT `fk_rt_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_item`
--

DROP TABLE IF EXISTS `return_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_item` (
                               `id` int NOT NULL AUTO_INCREMENT,
                               `return_id` int NOT NULL,
                               `order_item_id` int NOT NULL,
                               `quantity` int NOT NULL,
                               `condition_note` text COLLATE utf8mb4_unicode_ci COMMENT 'Tình trạng sản phẩm trả về',
                               PRIMARY KEY (`id`),
                               KEY `fk_ri_return` (`return_id`),
                               KEY `fk_ri_orderitem` (`order_item_id`),
                               CONSTRAINT `fk_ri_orderitem` FOREIGN KEY (`order_item_id`) REFERENCES `order_item` (`id`),
                               CONSTRAINT `fk_ri_return` FOREIGN KEY (`return_id`) REFERENCES `return_request` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_item`
--

LOCK TABLES `return_item` WRITE;
/*!40000 ALTER TABLE `return_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_request`
--

DROP TABLE IF EXISTS `return_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_request` (
                                  `id` int NOT NULL AUTO_INCREMENT,
                                  `order_id` int NOT NULL,
                                  `user_id` int NOT NULL,
                                  `reason` text COLLATE utf8mb4_unicode_ci NOT NULL,
                                  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
                                  `refund_method` enum('COD_REFUND','VNPAY_REFUND','STORE_CREDIT') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                  `refund_amount` decimal(15,0) DEFAULT NULL,
                                  `admin_note` text COLLATE utf8mb4_unicode_ci,
                                  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                  PRIMARY KEY (`id`),
                                  KEY `fk_rr_order` (`order_id`),
                                  KEY `fk_rr_user` (`user_id`),
                                  CONSTRAINT `fk_rr_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
                                  CONSTRAINT `fk_rr_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_request`
--

LOCK TABLES `return_request` WRITE;
/*!40000 ALTER TABLE `return_request` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
                          `id` int NOT NULL AUTO_INCREMENT,
                          `user_id` int NOT NULL,
                          `watch_id` int NOT NULL,
                          `order_id` int NOT NULL COMMENT 'Chỉ review sau khi đã mua',
                          `rating` tinyint NOT NULL,
                          `comment` text COLLATE utf8mb4_unicode_ci,
                          `is_approved` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Admin duyệt trước khi hiển thị',
                          `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `uq_review` (`user_id`,`watch_id`,`order_id`),
                          KEY `fk_rv_order` (`order_id`),
                          KEY `idx_review_watch` (`watch_id`),
                          CONSTRAINT `fk_rv_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
                          CONSTRAINT `fk_rv_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
                          CONSTRAINT `fk_rv_watch` FOREIGN KEY (`watch_id`) REFERENCES `watch` (`id`),
                          CONSTRAINT `review_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `segment`
--

DROP TABLE IF EXISTS `segment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `segment` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `delivery_method` enum('EXTERNAL_SHIPPER','DIRECT_SHOP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EXTERNAL_SHIPPER',
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `segment`
--

LOCK TABLES `segment` WRITE;
/*!40000 ALTER TABLE `segment` DISABLE KEYS */;
INSERT INTO `segment` VALUES (1,'Bình dân','EXTERNAL_SHIPPER'),(2,'Trung cấp','EXTERNAL_SHIPPER'),(3,'Luxury','DIRECT_SHOP');
/*!40000 ALTER TABLE `segment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipper`
--

DROP TABLE IF EXISTS `shipper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipper` (
                           `id` int NOT NULL AUTO_INCREMENT,
                           `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                           `api_endpoint` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                           `api_key` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                           `is_active` tinyint(1) NOT NULL DEFAULT '1',
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipper`
--

LOCK TABLES `shipper` WRITE;
/*!40000 ALTER TABLE `shipper` DISABLE KEYS */;
/*!40000 ALTER TABLE `shipper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                            `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                            `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                            `address` text COLLATE utf8mb4_unicode_ci,
                            `is_active` tinyint(1) NOT NULL DEFAULT '1',
                            `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier_brand`
--

DROP TABLE IF EXISTS `supplier_brand`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier_brand` (
                                  `supplier_id` int NOT NULL,
                                  `brand_id` int NOT NULL,
                                  PRIMARY KEY (`supplier_id`,`brand_id`),
                                  KEY `fk_sb_brand` (`brand_id`),
                                  CONSTRAINT `fk_sb_brand` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`) ON DELETE CASCADE,
                                  CONSTRAINT `fk_sb_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier_brand`
--

LOCK TABLES `supplier_brand` WRITE;
/*!40000 ALTER TABLE `supplier_brand` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier_brand` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
                        `id` int NOT NULL AUTO_INCREMENT,
                        `username` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
                        `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'NULL nếu đăng nhập Google',
                        `full_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                        `birthday` date DEFAULT NULL,
                        `auth_provider` enum('LOCAL','GOOGLE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LOCAL',
                        `google_id` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Sub từ Google OAuth',
                        `role` enum('CUSTOMER','ADMIN','STAFF') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
                        `loyalty_points` int NOT NULL DEFAULT '0',
                        `is_active` tinyint(1) NOT NULL DEFAULT '1',
                        `is_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Email đã xác thực OTP chưa',
                        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `email` (`email`),
                        UNIQUE KEY `username` (`username`),
                        UNIQUE KEY `google_id` (`google_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin','admin@gmail.com','$2a$10$jX4kka9ExaNQIjhl0lmBTOC3HG22JoEPW6HIf/yvH5ySrgr4TAMfC','Admin',NULL,NULL,'LOCAL',NULL,'ADMIN',0,1,1,'2026-05-27 08:31:41','2026-05-27 08:31:41'),(4,'DH52201225','dh52201225@student.stu.edu.vn','$2a$10$.v0sLXealqdijWiqU8BlXe1vf04qhfOi6GW4tJ06.pLi06S3LAfwm','Vo Thien Phu','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:29:28','2026-05-27 11:29:28'),(5,'axller','vtp15360@gmail.com','$2a$10$8r.AcoVt4IMYRWUqjcvD6eKr0UntmECkUdmwgsNgpsH8Vy.0IfD8O','Vo Thien Phu','0123456789','2007-12-12','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:35:03','2026-05-27 11:35:03'),(6,'quyvo2079@gmail.com','vtp113@gmail.com','$2a$10$mMyZmKYAPrKyeU1mpOJkvOMO9ADn0AsA6MsQVA0GJ8l12lOSyWQ3y','Vo Thien Phu','0123456789','2004-12-13','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:40:00','2026-05-27 11:40:00'),(7,'ades','vothienphu114@gmail.com','$2a$10$rLqrZ6P7AdqTOqWfym.G2.y8ZL17Nn5f7M0ADXDXUWpoc6LmV4j2e','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:41:26','2026-05-27 11:41:26'),(9,'adesee','vothienphu115@gmail.com','$2a$10$OGcPwsA.2QcxKMMk2EsoRukTW8c92MFwkaWjDF5w5xHv2fR8tsGhW','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:45:02','2026-05-27 11:45:02'),(11,'adeseeee','vothienphu116@gmail.com','$2a$10$kAWGECYpkApRVKTz.tQzzOTZ71fApCFWm.n84DxFentBVCFoqXnka','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:45:19','2026-05-27 11:45:19'),(12,'aáđâsdà','vothienphu117@gmail.com','$2a$10$USJj7tGmprcPhLt.miWiI.Bkyr3guDUu0e/M7cYqAIlEqF6CJaVAC','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:45:31','2026-05-27 11:45:31'),(13,'vothienphu777','anhtuhungdeveloper@gmail.com','$2a$10$P/AISue1/RLMOYGvAWUx5eVfh1zXoAuiHodr18gULmvZI.KZzm5Ki','Vo Thien Phu','0123456789','2000-02-12','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:46:19','2026-05-27 11:46:19'),(16,'otptest99','otptest99@test.com','$2a$10$IJuTEHwIa.sjOG2wHAgJEerkucPtQfMVxLRBTD2GmdF5E5wkCN5c2','OTP Test',NULL,NULL,'LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 12:13:16','2026-05-27 12:13:16'),(22,'vothienphu31313','vothienphu113@gmail.com','$2a$10$US6N/MUyPSCZbD3p1aaho.TQUmc2q1p1mpXIPz3hDejKwmNyeSqHG','alexander hungdodaide','0123456789','2004-01-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 14:28:15','2026-05-27 14:28:15'),(23,'VTP1225','quyvo2079@gmail.com','$2a$10$452VspYgoDn.GOzJesH8nOwhkT1q5/zk9RzWZnFdf3r8sYx8aHGJS','Vo Thien Phu','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,1,'2026-05-27 14:39:05','2026-05-27 14:39:19'),(24,'HTTP','truuonghoangbaodang3@gmail.com','$2a$10$Cust1EzvXDo9gmIBjYYVt.Q185YcpNmKbNS0ueug1QtndIOZ5cHSS','BAO DANG','0123456789',NULL,'LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-28 15:08:35','2026-05-28 15:08:35');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_address`
--

DROP TABLE IF EXISTS `user_address`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_address` (
                                `id` int NOT NULL AUTO_INCREMENT,
                                `user_id` int NOT NULL,
                                `recipient_name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
                                `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
                                `address_detail` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số nhà, tên đường',
                                `province` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                                `district` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                                `ward` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
                                `is_default` tinyint(1) NOT NULL DEFAULT '0',
                                PRIMARY KEY (`id`),
                                KEY `fk_ua_user` (`user_id`),
                                CONSTRAINT `fk_ua_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (1,23,'Võ Thiên Phú','0123456879','123/123','ttt','nhà bè','HP',0),(2,23,'Vo THien Phu','012356789','213/10','HCM','Nhà Bè','Hiep Phước',1);
/*!40000 ALTER TABLE `user_address` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch`
--

DROP TABLE IF EXISTS `watch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch` (
                         `id` int NOT NULL AUTO_INCREMENT,
                         `sku` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
                         `brand_id` int NOT NULL,
                         `category_id` int NOT NULL,
                         `segment_id` int NOT NULL,
                         `description` text COLLATE utf8mb4_unicode_ci,
                         `movement_type` enum('AUTOMATIC','MANUAL','QUARTZ','SOLAR','SMART') COLLATE utf8mb4_unicode_ci NOT NULL,
                         `glass_material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Sapphire / Mineral / Acrylic...',
                         `thickness_mm` decimal(5,2) DEFAULT NULL COMMENT 'Độ dày (mm)',
                         `water_resistance_atm` decimal(5,1) DEFAULT NULL COMMENT 'Chống nước (ATM)',
                         `power_reserve_hours` int DEFAULT NULL COMMENT 'Khoảng trữ cót (giờ)',
                         `battery_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Loại pin nếu là quartz',
                         `features` text COLLATE utf8mb4_unicode_ci COMMENT 'Tiện ích: lịch, báo thức, GPS...',
                         `is_active` tinyint(1) NOT NULL DEFAULT '1',
                         `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `sku` (`sku`),
                         KEY `idx_watch_brand` (`brand_id`),
                         KEY `idx_watch_segment` (`segment_id`),
                         KEY `idx_watch_category` (`category_id`),
                         CONSTRAINT `fk_w_brand` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
                         CONSTRAINT `fk_w_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
                         CONSTRAINT `fk_w_segment` FOREIGN KEY (`segment_id`) REFERENCES `segment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch`
--

LOCK TABLES `watch` WRITE;
/*!40000 ALTER TABLE `watch` DISABLE KEYS */;
INSERT INTO `watch` VALUES (1,'RLX-SUB-001','Rolex Submariner Date',1,7,3,'Đồng hồ lặn cao cấp của Rolex','AUTOMATIC','Sapphire',12.50,30.0,70,NULL,'Lịch ngày, chống nước, dạ quang',1,'2026-05-27 08:36:10','2026-05-27 08:36:10'),(2,'CAS-GS-001','Casio G-Shock GA-2100',2,6,1,'Mẫu G-Shock chống sốc nổi tiếng','QUARTZ','Mineral',11.80,20.0,NULL,'SR726W','Chống sốc, giờ thế giới, đèn LED',1,'2026-05-27 08:36:10','2026-05-27 08:36:10'),(3,'OMG-SM-001','Omega Seamaster Diver 300M',3,7,3,'Đồng hồ lặn cao cấp Omega','AUTOMATIC','Sapphire',13.60,30.0,55,NULL,'Helium valve, dạ quang',1,'2026-05-27 08:36:10','2026-05-27 08:36:10'),(4,'APL-WT-001','Apple Watch Series 9',4,11,2,'Đồng hồ thông minh Apple','SMART','Ion-X',10.70,5.0,NULL,NULL,'Heart Rate, GPS, Siri, Fitness',1,'2026-05-27 08:36:10','2026-05-27 08:36:10');
/*!40000 ALTER TABLE `watch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_variant`
--

DROP TABLE IF EXISTS `watch_variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_variant` (
                                 `id` int NOT NULL AUTO_INCREMENT,
                                 `watch_id` int NOT NULL,
                                 `dial_color_id` int DEFAULT NULL COMMENT 'Màu mặt số',
                                 `dial_color` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Màu mặt số',
                                 `strap_color_id` int DEFAULT NULL COMMENT 'Màu dây',
                                 `strap_color` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Màu dây',
                                 `strap_material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Chất liệu dây: da / thép / cao su...',
                                 `case_size_mm` decimal(5,2) DEFAULT NULL COMMENT 'Kích thước mặt (mm)',
                                 `price` decimal(15,0) NOT NULL,
                                 `image_url` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện biến thể',
                                 `stock_quantity` int NOT NULL DEFAULT '0',
                                 `is_active` tinyint(1) NOT NULL DEFAULT '1',
                                 PRIMARY KEY (`id`),
                                 KEY `idx_watch_variant` (`watch_id`),
                                 KEY `idx_wv_dial_color` (`dial_color_id`),
                                 KEY `idx_wv_strap_color` (`strap_color_id`),
                                 CONSTRAINT `fk_wv_dial_color` FOREIGN KEY (`dial_color_id`) REFERENCES `color` (`id`) ON DELETE SET NULL,
                                 CONSTRAINT `fk_wv_strap_color` FOREIGN KEY (`strap_color_id`) REFERENCES `color` (`id`) ON DELETE SET NULL,
                                 CONSTRAINT `fk_wv_watch` FOREIGN KEY (`watch_id`) REFERENCES `watch` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_variant`
--

LOCK TABLES `watch_variant` WRITE;
/*!40000 ALTER TABLE `watch_variant` DISABLE KEYS */;
INSERT INTO `watch_variant` VALUES (1,1,1,NULL,5,NULL,'Thép không gỉ',41.00,320000000,'https://example.com/rolex-sub-black.jpg',3,1),(2,1,3,NULL,5,NULL,'Thép không gỉ',41.00,345000000,'https://example.com/rolex-sub-blue.jpg',3,1),(3,2,1,NULL,1,NULL,'Resin',45.00,3500000,'https://example.com/gshock-black.jpg',20,1),(4,3,3,NULL,5,NULL,'Thép không gỉ',42.00,180000000,'https://example.com/omega-blue.jpg',4,1),(5,4,1,NULL,1,NULL,'Silicone',45.00,12990000,'https://example.com/applewatch-black.jpg',15,1);
/*!40000 ALTER TABLE `watch_variant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_variant_image`
--

DROP TABLE IF EXISTS `watch_variant_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_variant_image` (
                                       `id` int NOT NULL AUTO_INCREMENT,
                                       `variant_id` int NOT NULL,
                                       `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
                                       `public_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                       `alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
                                       `is_primary` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Ảnh đại diện của biến thể này',
                                       `is_main_image` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Ảnh đại diện hiển thị chung cho toàn sản phẩm',
                                       `sort_order` int NOT NULL DEFAULT '0',
                                       PRIMARY KEY (`id`),
                                       KEY `fk_wvi_variant` (`variant_id`),
                                       CONSTRAINT `fk_wvi_variant` FOREIGN KEY (`variant_id`) REFERENCES `watch_variant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_variant_image`
--

LOCK TABLES `watch_variant_image` WRITE;
/*!40000 ALTER TABLE `watch_variant_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `watch_variant_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist`
--

DROP TABLE IF EXISTS `wishlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist` (
                            `id` int NOT NULL AUTO_INCREMENT,
                            `user_id` int NOT NULL,
                            `watch_variant_id` int NOT NULL,
                            `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            PRIMARY KEY (`id`),
                            UNIQUE KEY `uq_wishlist` (`user_id`,`watch_variant_id`),
                            KEY `fk_wl_variant` (`watch_variant_id`),
                            CONSTRAINT `fk_wl_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
                            CONSTRAINT `fk_wl_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-02 13:29:40
