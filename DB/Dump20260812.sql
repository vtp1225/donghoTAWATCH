-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: Tawatch
-- ------------------------------------------------------
-- Server version	8.0.36

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
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'CREATE | UPDATE | DELETE | APPROVE...',
  `table_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` int DEFAULT NULL,
  `old_value` json DEFAULT NULL COMMENT 'Giá trị trước khi thay đổi',
  `new_value` json DEFAULT NULL COMMENT 'Giá trị sau khi thay đổi',
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_admin_log_admin` (`admin_id`,`created_at`),
  CONSTRAINT `fk_al_admin` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_log`
--

LOCK TABLES `admin_log` WRITE;
/*!40000 ALTER TABLE `admin_log` DISABLE KEYS */;
INSERT INTO `admin_log` VALUES (1,1,'UPDATE','orders',NULL,NULL,NULL,'127.0.0.1','2026-08-08 08:43:57'),(2,1,'UPDATE','orders',NULL,NULL,NULL,'127.0.0.1','2026-08-08 08:44:00'),(3,1,'CREATE','colors',NULL,NULL,'{\"name\": \"Vang vang\", \"hexCode\": \"#e3d578\", \"isActive\": true}','127.0.0.1','2026-08-08 08:45:49'),(4,1,'UPDATE','watches',NULL,NULL,'{\"id\": 34}','127.0.0.1','2026-08-08 08:51:34'),(5,1,'UPDATE','watches',NULL,NULL,'{\"id\": 34, \"name\": \"ROLEX\", \"isActive\": true}','127.0.0.1','2026-08-08 09:01:33'),(6,1,'UPDATE','orders',NULL,NULL,'{\"id\": 47, \"status\": \"CANCELLED\", \"orderCode\": \"ORD-20260808-487502\"}','127.0.0.1','2026-08-08 09:01:55'),(7,22,'UPDATE','orders',NULL,NULL,'{\"id\": 45, \"status\": \"SHIPPING\", \"orderCode\": \"ORD-20260807-873512\"}','127.0.0.1','2026-08-08 09:02:30'),(8,22,'UPDATE','orders',NULL,NULL,'{\"id\": 45, \"status\": \"DELIVERED\", \"orderCode\": \"ORD-20260807-873512\"}','127.0.0.1','2026-08-08 09:02:31'),(9,1,'UPDATE','watches',NULL,NULL,'{\"id\": 32, \"name\": \"Apple Watch Ultra 2\", \"isActive\": true}','127.0.0.1','2026-08-08 09:51:15'),(10,1,'UPDATE','watch_variants',NULL,NULL,'{\"id\": 40, \"isActive\": true}','127.0.0.1','2026-08-08 09:51:15'),(11,1,'UPDATE','watch_variant_images',NULL,NULL,'{\"id\": 33}','127.0.0.1','2026-08-08 09:51:15'),(12,1,'UPDATE','watch_variants',NULL,NULL,'{\"id\": 41, \"isActive\": true}','127.0.0.1','2026-08-08 09:51:15'),(13,1,'UPDATE','watch_variant_images',NULL,NULL,'{\"id\": 45}','127.0.0.1','2026-08-08 09:51:15'),(14,1,'UPDATE','watches',NULL,NULL,'{\"id\": 25, \"name\": \"Rolex Day-Date 40\", \"isActive\": true}','127.0.0.1','2026-08-08 09:52:07'),(15,1,'UPDATE','watch_variants',NULL,NULL,'{\"id\": 30, \"isActive\": true}','127.0.0.1','2026-08-08 09:52:07'),(16,1,'UPDATE','watch_variant_images',NULL,NULL,'{\"id\": 40}','127.0.0.1','2026-08-08 09:52:07'),(17,1,'CREATE','import_receipts',NULL,NULL,'{\"info\": \"Updated\"}','127.0.0.1','2026-08-08 10:00:08'),(18,1,'UPDATE','import_receipts',NULL,NULL,'{\"id\": 8}','127.0.0.1','2026-08-08 10:00:13'),(19,1,'UPDATE','orders',NULL,NULL,'{\"id\": 41, \"status\": \"CONFIRMED\", \"orderCode\": \"ORD-20260806-085815\"}','127.0.0.1','2026-08-10 12:55:04'),(20,1,'UPDATE','orders',NULL,NULL,'{\"id\": 41, \"status\": \"PROCESSING\", \"orderCode\": \"ORD-20260806-085815\"}','127.0.0.1','2026-08-10 12:55:05'),(21,1,'UPDATE','orders',NULL,NULL,'{\"id\": 41, \"status\": \"SHIPPING\", \"orderCode\": \"ORD-20260806-085815\"}','127.0.0.1','2026-08-10 12:55:06'),(22,1,'UPDATE','orders',NULL,NULL,'{\"id\": 42, \"status\": \"CONFIRMED\", \"orderCode\": \"ORD-20260807-357193\"}','127.0.0.1','2026-08-10 13:03:34'),(23,1,'UPDATE','orders',NULL,NULL,'{\"id\": 42, \"status\": \"PROCESSING\", \"orderCode\": \"ORD-20260807-357193\"}','127.0.0.1','2026-08-10 13:03:36'),(24,1,'UPDATE','orders',NULL,NULL,'{\"id\": 42, \"status\": \"SHIPPING\", \"orderCode\": \"ORD-20260807-357193\"}','127.0.0.1','2026-08-10 13:03:37'),(25,1,'UPDATE','orders',NULL,NULL,'{\"id\": 48, \"status\": \"CONFIRMED\", \"orderCode\": \"ORD-20260810-165283\"}','127.0.0.1','2026-08-10 13:06:17'),(26,1,'UPDATE','orders',NULL,NULL,'{\"id\": 48, \"status\": \"PROCESSING\", \"orderCode\": \"ORD-20260810-165283\"}','127.0.0.1','2026-08-10 13:06:18'),(27,1,'UPDATE','orders',NULL,NULL,'{\"id\": 48, \"status\": \"SHIPPING\", \"orderCode\": \"ORD-20260810-165283\"}','127.0.0.1','2026-08-10 13:06:29'),(28,1,'UPDATE','orders',NULL,NULL,'{\"id\": 48, \"status\": \"DELIVERED\", \"orderCode\": \"ORD-20260810-165283\"}','127.0.0.1','2026-08-10 13:13:33'),(29,1,'UPDATE','orders',NULL,NULL,'{\"id\": 44, \"status\": \"PROCESSING\", \"orderCode\": \"ORD-20260807-318739\"}','127.0.0.1','2026-08-10 13:13:35'),(30,1,'UPDATE','orders',NULL,NULL,'{\"id\": 44, \"status\": \"SHIPPING\", \"orderCode\": \"ORD-20260807-318739\"}','127.0.0.1','2026-08-10 13:13:36');
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `logo_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `slug` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_brand_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brand`
--

LOCK TABLES `brand` WRITE;
/*!40000 ALTER TABLE `brand` DISABLE KEYS */;
INSERT INTO `brand` VALUES (1,'Rolex','Thụy Sĩ','Thương hiệu đồng hồ luxury nổi tiếng',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10',NULL),(2,'Casio','Nhật Bản','Đồng hồ điện tử và quartz phổ biến',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10',NULL),(3,'Omega','Thụy Sĩ','Thương hiệu đồng hồ cao cấp',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10',NULL),(4,'Apple','Mỹ','Đồng hồ thông minh Apple Watch',NULL,1,'2026-05-27 08:36:10','2026-05-27 08:36:10',NULL),(5,'Rolex','Thụy Sĩ',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','rolex'),(6,'Omega','Thụy Sĩ',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','omega'),(7,'Seiko','Nhật Bản',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','seiko'),(8,'Casio','Nhật Bản',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','casio'),(9,'TAG Heuer','Thụy Sĩ',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','tag-heuer'),(10,'Tissot','Thụy Sĩ',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','tissot'),(11,'Longines','Thụy Sĩ',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','longines'),(12,'IWC','Thụy Sĩ',NULL,NULL,1,'2026-06-15 13:13:18','2026-06-15 13:13:18','iwc'),(13,'thuong hieu moi ',NULL,'ADB',NULL,1,'2026-08-07 08:41:21','2026-08-07 08:41:21','thuong-hieu-moi');
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
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Session ID cho guest',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_cart_user` (`user_id`),
  KEY `idx_cart_session` (`session_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (1,NULL,'guest-ef641e12-ec0c-4186-beca-09d83f4078eb','2026-05-27 08:37:23','2026-06-03 12:24:32'),(4,4,NULL,'2026-05-27 11:29:28','2026-08-03 11:59:54'),(5,5,NULL,'2026-05-27 11:35:03','2026-05-27 11:35:03'),(6,6,NULL,'2026-05-27 11:40:00','2026-05-27 11:40:00'),(7,7,NULL,'2026-05-27 11:41:26','2026-05-27 11:41:26'),(8,9,NULL,'2026-05-27 11:45:02','2026-05-27 11:45:02'),(9,11,NULL,'2026-05-27 11:45:19','2026-05-27 11:45:19'),(10,12,NULL,'2026-05-27 11:45:31','2026-05-27 11:45:31'),(11,13,NULL,'2026-05-27 11:46:19','2026-05-27 11:46:19'),(14,16,NULL,'2026-05-27 12:13:16','2026-05-27 12:13:16'),(19,22,NULL,'2026-05-27 14:28:15','2026-08-10 13:06:05'),(20,23,NULL,'2026-05-27 14:39:05','2026-08-06 17:27:38'),(21,24,NULL,'2026-05-28 15:08:35','2026-05-28 15:08:35'),(22,1,NULL,'2026-05-29 12:50:30','2026-08-10 12:54:35'),(23,NULL,'guest-a60bcaf0-b204-4152-9beb-c1a77fbf34ba','2026-06-03 11:07:33','2026-06-13 04:48:20'),(24,NULL,'guest-4f754e12-4c76-47bf-b551-ed6536d87688','2026-06-05 02:56:15','2026-06-05 04:07:55'),(25,NULL,'guest-5a1bf995-15e0-4b80-80eb-c3f1555cdfee','2026-06-05 06:12:37','2026-06-05 06:13:06'),(26,NULL,'guest-a29b4a05-3fa0-4037-97e9-3477920a4e55','2026-06-05 06:34:27','2026-06-05 06:34:27'),(27,NULL,'guest-0cf61842-1b1f-4842-8b1a-2587692bef38','2026-06-13 08:15:49','2026-06-13 08:15:49'),(28,NULL,'guest-d62939f0-b88c-43de-8e97-e91967fe13b8','2026-06-13 09:13:16','2026-06-13 09:13:16'),(29,NULL,'guest-7212e1e7-0432-4b20-b79f-fd9aa01f3661','2026-06-19 02:31:42','2026-06-19 02:31:42'),(30,NULL,'guest-ff14e145-245b-4bc5-89ba-e7cd7fa68246','2026-06-19 04:13:53','2026-06-19 04:13:53'),(31,NULL,'guest-ff14e145-245b-4bc5-89ba-e7cd7fa68246','2026-06-19 04:13:54','2026-06-19 04:13:54'),(32,NULL,'guest-b24f2fec-ee30-4a00-9ba0-382e5b4ec0f0','2026-06-19 11:31:43','2026-06-19 11:31:43'),(33,NULL,'guest-4bdfc478-0f31-4cea-91cd-1796b0f3f457','2026-06-19 15:59:46','2026-06-19 15:59:46'),(34,NULL,'guest-32212767-b3ac-4bb3-9064-ac956554337a','2026-06-20 08:06:01','2026-06-20 08:06:01'),(35,NULL,'guest-afce08e8-f563-4ba0-b3b3-9db0b0f60a1e','2026-06-23 07:36:58','2026-06-23 07:36:58'),(36,NULL,'guest-49251115-6b52-4797-aaf0-5003182b6219','2026-06-24 05:54:41','2026-06-24 05:54:41'),(37,NULL,'guest-f19dc72c-dad8-4221-afd2-74a6dea01706','2026-06-24 11:12:17','2026-06-24 11:12:17'),(38,NULL,'guest-03e38384-ba8d-4afc-ad9d-ea149406f6ba','2026-06-24 11:20:25','2026-06-24 11:20:25'),(39,NULL,'guest-cd9d6090-6b20-4ab0-a0df-3b337cccdc8e','2026-06-24 17:51:16','2026-06-24 17:51:16'),(40,NULL,'guest-de95582f-c9e1-4f20-858e-771048c103d9','2026-06-25 04:05:52','2026-06-25 04:05:52'),(41,NULL,'guest-f6b8b256-c6eb-47ab-b4d3-5b12eadb6a37','2026-06-25 04:11:43','2026-06-25 04:11:43'),(42,NULL,'guest-4a486813-69d9-4234-9bb5-c6cc1be9c10a','2026-06-25 12:19:47','2026-06-25 12:19:47'),(43,NULL,'guest-e52e67b8-74da-4495-9131-e3c674a8f3d7','2026-06-29 09:44:47','2026-06-29 09:44:47'),(44,NULL,'guest-a61921e2-ecac-4074-bc1b-ebd29a473c6d','2026-07-01 07:21:37','2026-07-01 07:21:37'),(45,NULL,'guest-02c50506-2986-40ee-8ec0-d5439b72997a','2026-07-13 02:23:52','2026-07-22 15:39:14'),(47,NULL,'guest-e45c66fc-dc92-4d92-b44c-398f3bc0ff94','2026-08-03 09:25:27','2026-08-03 09:25:27'),(48,NULL,'guest-eefc2d61-2673-4490-96fe-7a95c460a1e3','2026-08-07 02:28:19','2026-08-07 02:28:19'),(49,NULL,'guest-4a287c11-bd1a-494d-bbfe-d1dd8c05ee42','2026-08-07 06:19:38','2026-08-07 06:48:50'),(50,NULL,'guest-908520d9-e0ba-455a-8f43-78ceca042a86','2026-08-08 09:02:39','2026-08-08 09:02:39');
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
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_item`
--

LOCK TABLES `cart_item` WRITE;
/*!40000 ALTER TABLE `cart_item` DISABLE KEYS */;
INSERT INTO `cart_item` VALUES (10,24,5,1,12990000),(11,25,9,1,123123000),(12,23,8,1,10000000),(13,23,10,1,1000000),(59,45,15,1,150000000),(121,49,27,1,320000000),(125,22,41,0,1222200),(126,22,27,2,320000000),(127,22,15,2,150000000);
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
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `is_active` bit(1) NOT NULL DEFAULT b'1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_cat_parent` (`parent_id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `category` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Đồng hồ nam','dong-ho-nam',NULL,_binary ''),(2,'Đồng hồ nữ','dong-ho-nu',NULL,_binary ''),(3,'Đồng hồ đôi','dong-ho-doi',NULL,_binary ''),(4,'Smart Watch','smart-watch',NULL,_binary ''),(5,'Automatic Nam','automatic-nam',1,_binary ''),(6,'Quartz Nam','quartz-nam',1,_binary ''),(7,'Luxury Nam','luxury-nam',1,_binary ''),(8,'Automatic Nữ','automatic-nu',2,_binary ''),(9,'Quartz Nữ','quartz-nu',2,_binary ''),(10,'Luxury Nữ','luxury-nu',2,_binary ''),(11,'Apple Watch','apple-watch',4,_binary ''),(12,'Samsung Watch','samsung-watch',4,_binary ''),(13,'Garmin Watch','garmin-watch',4,_binary ''),(14,'Đồng hồ Thể thao','dong-ho-the-thao',NULL,_binary ''),(15,'Đồng hồ Lặn','dong-ho-lan',NULL,_binary ''),(16,'Đồng hồ Phi công','dong-ho-phi-cong',NULL,_binary '');
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
  `name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `hex_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã màu HEX, ví dụ #000000',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `uk_color_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `color`
--

LOCK TABLES `color` WRITE;
/*!40000 ALTER TABLE `color` DISABLE KEYS */;
INSERT INTO `color` VALUES (1,'Đen','#000000',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(2,'Trắng','#FFFFFF',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(4,'Đỏ','#FF0000',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(5,'Bạc','#C0C0C0',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(6,'Vàng','#FFD700',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(7,'Nâu','#8B4513',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(8,'Xám','#808080',1,'2026-05-27 08:33:39','2026-05-27 08:33:39'),(9,'Black','#000000',1,'2026-06-15 13:13:19','2026-08-06 13:59:33'),(10,'Silver','#C0C0C0',1,'2026-06-15 13:13:19','2026-06-15 13:13:19'),(11,'Blue','#1E3A8A',1,'2026-06-15 13:13:19','2026-08-06 13:16:21'),(12,'Green','#166534',1,'2026-06-15 13:13:19','2026-06-15 13:13:19'),(13,'White','#FFFFFF',1,'2026-06-15 13:13:19','2026-06-15 13:13:19'),(14,'Gold','#B8860B',1,'2026-06-15 13:13:19','2026-06-15 13:13:19'),(15,'Brown','#78350F',1,'2026-06-15 13:13:19','2026-06-15 13:13:19'),(16,'Champagne','#F5DEB3',1,'2026-06-15 13:13:19','2026-06-15 13:13:19'),(17,'Hồng Cánh Sen','#fd99ff',1,'2026-08-06 13:16:12','2026-08-06 13:16:12'),(19,'Vang vang','#e3d578',1,'2026-08-08 08:45:49','2026-08-08 08:45:49');
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
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (4,14,'PPPPPP',NULL,0,NULL,'2026-08-21 09:30:00'),(6,15,'MAMA',NULL,0,NULL,'2026-08-15 06:42:00');
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
  `receipt_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `supplier_id` int NOT NULL,
  `created_by` int NOT NULL COMMENT 'admin/staff tạo phiếu',
  `total_amount` decimal(15,0) NOT NULL DEFAULT '0',
  `status` enum('DRAFT','PENDING','CONFIRMED','COMPLETED','CANCELLED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `import_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `receipt_code` (`receipt_code`),
  KEY `fk_ir_creator` (`created_by`),
  KEY `idx_import_supplier` (`supplier_id`),
  CONSTRAINT `fk_ir_creator` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_ir_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `supplier` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt`
--

LOCK TABLES `import_receipt` WRITE;
/*!40000 ALTER TABLE `import_receipt` DISABLE KEYS */;
INSERT INTO `import_receipt` VALUES (2,'RC-20260625-1367',1,23,2000000,'CONFIRMED','ok','2026-06-25','2026-06-25 11:05:39','2026-06-25 11:05:46'),(3,'RC-20260625-2609',1,23,10000000,'CONFIRMED','Nhâp kho mấy cái sắp hết','2026-06-25','2026-06-25 11:07:42','2026-06-25 11:07:47'),(4,'RC-20260804-5069',1,23,10833000,'CANCELLED','Nhap San pham moi','2026-08-04','2026-08-04 06:04:28','2026-08-04 06:04:51'),(5,'RC-20260804-8853',1,23,8000000,'CONFIRMED',NULL,'2026-08-04','2026-08-04 06:05:25','2026-08-07 07:45:19'),(6,'RC-20260806-6858',1,23,11000000,'CONFIRMED','Nhap lon','2026-08-06','2026-08-06 14:02:11','2026-08-06 14:02:18'),(7,'RC-20260806-7555',1,23,12666666,'CONFIRMED',NULL,'2026-08-06','2026-08-06 16:31:13','2026-08-06 16:31:30'),(8,'RC-20260808-0746',2,1,33600000,'CONFIRMED',NULL,'2026-08-08','2026-08-08 10:00:07','2026-08-08 10:00:12');
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
  `batch_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Số lô hàng',
  `expiry_date` date DEFAULT NULL COMMENT 'Hạn bảo hành / hạn dùng nếu có',
  PRIMARY KEY (`id`),
  KEY `fk_iri_receipt` (`receipt_id`),
  KEY `fk_iri_variant` (`watch_variant_id`),
  CONSTRAINT `fk_iri_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `import_receipt` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_iri_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `import_receipt_item`
--

LOCK TABLES `import_receipt_item` WRITE;
/*!40000 ALTER TABLE `import_receipt_item` DISABLE KEYS */;
INSERT INTO `import_receipt_item` VALUES (4,3,21,10,1000000,10000000,NULL,NULL),(5,4,25,5,2000000,10000000,NULL,NULL),(6,4,23,1,833000,833000,NULL,NULL),(7,5,14,1,8000000,8000000,NULL,NULL),(8,6,17,1,5000000,5000000,NULL,NULL),(9,6,22,10,600000,6000000,NULL,NULL),(11,7,27,6,1000000,6000000,NULL,NULL),(12,8,19,3,11200000,33600000,NULL,NULL);
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
  `order_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int DEFAULT NULL COMMENT 'NULL nếu guest',
  `guest_email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Dùng khi guest đặt hàng',
  `guest_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guest_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_id` int DEFAULT NULL COMMENT 'Địa chỉ đã lưu (nếu có TK)',
  `shipping_address_snapshot` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtotal` decimal(15,0) NOT NULL,
  `discount_amount` decimal(15,0) NOT NULL DEFAULT '0',
  `shipping_fee` decimal(15,0) NOT NULL DEFAULT '0',
  `total_amount` decimal(15,0) NOT NULL,
  `coupon_id` int DEFAULT NULL,
  `payment_method` enum('BANK_TRANSFER','COD','MOMO','VNPAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('FAILED','PAID','PENDING','REFUNDED','UNPAID') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `order_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_method` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tracking_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã vận đơn GHTK/GHN',
  `shipper_id` int DEFAULT NULL COMMENT 'Đơn vị giao hàng bên ngoài',
  `note` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `return_reason` tinytext COLLATE utf8mb4_unicode_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
INSERT INTO `order` VALUES (17,'ORD-20260620-387967',22,NULL,NULL,NULL,NULL,'{\"recipientName\":\"VÕ Thiên Phú\",\"phone\":\"0906632044\",\"addressDetail\":\"231/10\",\"ward\":\"Hiệp Phước\",\"district\":\"Nhà Bè\",\"province\":\"Hồ Chí Minh\"}',145000000,0,0,145000000,NULL,'COD','UNPAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-20 09:23:08','2026-06-20 09:23:51',NULL),(18,'ORD-20260623-704057',22,NULL,NULL,NULL,4,'{\"recipientName\":\"Võ Thiên Phú\",\"phone\":\"03999888999\",\"addressDetail\":\"231/10 Ấp3\",\"ward\":\"Xã Hiệp Phước\",\"district\":\"Huyện Nhà Bè\",\"province\":\"Hồ Chí Minh\"}',290000000,0,29001,290029001,NULL,'COD','UNPAID','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-23 12:28:24','2026-06-23 12:28:24',NULL),(19,'ORD-20260625-933967',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',174890000,0,29001,174919001,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 05:55:34','2026-08-07 02:41:45',NULL),(20,'ORD-20260625-112848',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\"}',4200000,0,39001,4239001,NULL,'VNPAY','PENDING','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 06:31:53','2026-06-25 06:31:53',NULL),(21,'ORD-20260625-202090',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\"}',1800000,0,39001,1839001,NULL,'VNPAY','REFUNDED','REFUNDED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 06:33:22','2026-08-07 05:28:02','Toi khong thich'),(22,'ORD-20260625-362633',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\"}',4200000,0,39001,4239001,NULL,'VNPAY','PENDING','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 06:36:03','2026-06-25 06:36:03',NULL),(23,'ORD-20260625-533000',22,NULL,NULL,NULL,4,'{\"recipientName\":\"Võ Thiên Phú\",\"phone\":\"03999888999\",\"addressDetail\":\"231/10 Ấp3\",\"ward\":\"Xã Hiệp Phước\",\"district\":\"Huyện Nhà Bè\",\"province\":\"Hồ Chí Minh\"}',241800000,0,29001,241829001,NULL,'VNPAY','PENDING','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 06:38:53','2026-06-25 06:38:53',NULL),(24,'ORD-20260625-286375',22,NULL,NULL,NULL,4,'{\"recipientName\":\"Võ Thiên Phú\",\"phone\":\"03999888999\",\"addressDetail\":\"231/10 Ấp3\",\"ward\":\"Xã Hiệp Phước\",\"district\":\"Huyện Nhà Bè\",\"province\":\"Hồ Chí Minh\"}',1800000,0,29001,1829001,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 06:51:26','2026-06-25 08:10:46',NULL),(25,'ORD-20260625-866078',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',150000000,0,29001,150029001,NULL,'COD','UNPAID','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 07:01:06','2026-06-25 07:01:06',NULL),(26,'ORD-20260625-880697',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',19990000,0,29001,20019001,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 07:01:21','2026-06-25 08:10:39',NULL),(27,'ORD-20260625-675959',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',19990000,0,29001,20019001,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 07:31:16','2026-06-25 08:10:35',NULL),(28,'ORD-20260625-068878',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',80000000,0,29001,80029001,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 07:37:49','2026-06-25 08:10:33',NULL),(29,'ORD-20260625-538410',22,NULL,NULL,NULL,4,'{\"recipientName\":\"Võ Thiên Phú\",\"phone\":\"03999888999\",\"addressDetail\":\"231/10 Ấp3\",\"ward\":\"Xã Hiệp Phước\",\"district\":\"Huyện Nhà Bè\",\"province\":\"Hồ Chí Minh\"}',430000000,0,29001,430029001,NULL,'VNPAY','PENDING','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 12:45:38','2026-06-25 12:45:38',NULL),(30,'ORD-20260625-934182',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',24190000,0,29001,24219001,NULL,'COD','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-25 12:52:14','2026-08-07 02:41:28',NULL),(31,'ORD-20260629-838049',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\"}',99990000,0,29001,100019001,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-29 06:50:38','2026-06-29 09:45:36',NULL),(32,'ORD-20260629-269956',22,NULL,NULL,NULL,4,'{\"recipientName\":\"Võ Thiên Phú\",\"phone\":\"03999888999\",\"addressDetail\":\"231/10 Ấp3\",\"ward\":\"Xã Hiệp Phước\",\"district\":\"Huyện Nhà Bè\",\"province\":\"Hồ Chí Minh\"}',11700000,0,29001,11729001,NULL,'COD','PAID','REFUNDED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-29 09:44:30','2026-08-07 05:17:30','Hang loi'),(33,'ORD-20260629-453995',4,NULL,NULL,NULL,7,'{\"recipientName\":\"VTP\",\"phone\":\"020202022\",\"addressDetail\":\"123\",\"ward\":\"Xã Dân Hạ\",\"district\":\"Huyện Kỳ Sơn\",\"province\":\"Hòa Bình\"}',180000000,0,29001,180029001,NULL,'COD','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-06-29 09:47:34','2026-06-29 09:47:47',NULL),(34,'ORD-20260803-457428',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',26500000,1325000,104500,25279500,NULL,'COD','UNPAID','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-03 10:54:17','2026-08-03 10:54:17',NULL),(35,'ORD-20260803-332817',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',150000000,2000000,104500,148104500,4,'VNPAY','PENDING','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-03 11:58:53','2026-08-03 11:58:53',NULL),(36,'ORD-20260803-361795',4,NULL,NULL,NULL,7,'{\"recipientName\":\"VTP\",\"phone\":\"020202022\",\"addressDetail\":\"123\",\"ward\":\"Xã Dân Hạ\",\"district\":\"Huyện Kỳ Sơn\",\"province\":\"Hòa Bình\",\"ghnDistrictId\":1955,\"ghnWardCode\":\"230602\"}',161700000,5234000,93500,156559500,4,'COD','UNPAID','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-03 11:59:22','2026-08-03 11:59:22',NULL),(37,'ORD-20260803-376900',4,NULL,NULL,NULL,7,'{\"recipientName\":\"VTP\",\"phone\":\"020202022\",\"addressDetail\":\"123\",\"ward\":\"Xã Dân Hạ\",\"district\":\"Huyện Kỳ Sơn\",\"province\":\"Hòa Bình\",\"ghnDistrictId\":1955,\"ghnWardCode\":\"230602\"}',1222200,24444,93500,1291256,NULL,'COD','UNPAID','PENDING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-03 11:59:37','2026-08-03 11:59:37',NULL),(38,'ORD-20260803-393431',4,NULL,NULL,NULL,7,'{\"recipientName\":\"VTP\",\"phone\":\"020202022\",\"addressDetail\":\"123\",\"ward\":\"Xã Dân Hạ\",\"district\":\"Huyện Kỳ Sơn\",\"province\":\"Hòa Bình\",\"ghnDistrictId\":1955,\"ghnWardCode\":\"230602\"}',90000000,1800000,93500,88293500,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-03 11:59:53','2026-08-07 02:29:56',NULL),(39,'ORD-20260803-353578',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',150000000,0,104500,150104500,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-03 12:15:54','2026-08-06 13:04:42',NULL),(40,'ORD-20260806-290441',23,NULL,NULL,NULL,NULL,'{\"recipientName\":\"HP\",\"phone\":\"013456789\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Diên Hồng\",\"district\":\"Huyện Kim Động\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":1717,\"ghnWardCode\":\"91394\"}',280000000,2000000,0,278000000,4,'VNPAY','PENDING','CANCELLED','DIRECT_SHOP',NULL,NULL,'Love iu','2026-08-06 13:34:50','2026-08-07 04:55:05',NULL),(41,'ORD-20260806-085815',NULL,'helo@gmail.com','0123456789','NGUYEN VAN A',NULL,'{\"recipientName\":\"NGUYEN VAN A\",\"phone\":\"0123456789\",\"addressDetail\":\"Nha toi, Xã Chiềng Sơ, Huyện Điện Biên Đông, Điện Biên\",\"ghnDistrictId\":2123,\"ghnWardCode\":\"620702\"}',330000000,0,104500,330104500,NULL,'VNPAY','PENDING','SHIPPING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-06 14:54:46','2026-08-10 12:55:06',NULL),(42,'ORD-20260807-357193',22,NULL,NULL,NULL,4,'{\"recipientName\":\"Võ Thiên Phú\",\"phone\":\"03999888999\",\"addressDetail\":\"231/10 Ấp3\",\"ward\":\"Xã Hiệp Phước\",\"district\":\"Huyện Nhà Bè\",\"province\":\"Hồ Chí Minh\",\"ghnDistrictId\":1534,\"ghnWardCode\":\"22302\"}',29890000,2092300,64900,27862600,4,'VNPAY','PENDING','SHIPPING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-07 02:39:17','2026-08-10 13:03:37',NULL),(43,'ORD-20260807-649106',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',4200000,84000,104500,4220500,NULL,'VNPAY','PAID','CONFIRMED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-07 04:57:29','2026-08-07 04:57:59',NULL),(44,'ORD-20260807-318739',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',9900000,198000,104500,9806500,NULL,'VNPAY','PAID','SHIPPING','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-07 05:41:59','2026-08-10 13:13:36',NULL),(45,'ORD-20260807-873512',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',280000000,5600000,104500,274504500,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-07 05:51:14','2026-08-08 09:02:31',NULL),(46,'ORD-20260807-098251',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',1222200,24444,104500,1302256,NULL,'VNPAY','PAID','DELIVERED','EXTERNAL_SHIPPER',NULL,NULL,NULL,'2026-08-07 05:54:58','2026-08-07 08:36:32',NULL),(47,'ORD-20260808-487502',1,NULL,NULL,NULL,6,'{\"recipientName\":\"TP\",\"phone\":\"0123456789\",\"addressDetail\":\"235\",\"ward\":\"Xã Chỉ Đạo\",\"district\":\"Huyện Văn Lâm\",\"province\":\"Hưng Yên\",\"ghnDistrictId\":2046,\"ghnWardCode\":\"220902\"}',339990000,74797800,104500,265296700,6,'COD','UNPAID','CANCELLED','EXTERNAL_SHIPPER',NULL,NULL,'Helllo\n','2026-08-08 06:44:48','2026-08-08 09:01:55',NULL),(48,'ORD-20260810-165283',22,NULL,NULL,NULL,9,'{\"recipientName\":\"nn\",\"phone\":\"0906632044\",\"addressDetail\":\"231/5\",\"ward\":\"Xã Bản Lầu\",\"district\":\"Huyện Mường Khương\",\"province\":\"Lào Cai\",\"ghnDistrictId\":2171,\"ghnWardCode\":\"80902\"}',92000000,1840000,104500,90264500,NULL,'COD','PAID','DELIVERED','EXTERNAL_SHIPPER','L89VTV',NULL,NULL,'2026-08-10 13:06:05','2026-08-10 13:13:33',NULL);
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
  `unit_cost` decimal(15,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_oi_order` (`order_id`),
  KEY `fk_oi_variant` (`watch_variant_id`),
  CONSTRAINT `fk_oi_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oi_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_item`
--

LOCK TABLES `order_item` WRITE;
/*!40000 ALTER TABLE `order_item` DISABLE KEYS */;
INSERT INTO `order_item` VALUES (19,17,22,'{\"sku\": \"OMG-SPD-324.30.38\", \"name\": \"Omega Speedmaster 38\", \"brand\": \"Omega\", \"price\": 145000000, \"watchId\": 19, \"imageUrl\": \"\", \"dialColor\": \"White\", \"variantId\": 22, \"caseSizeMm\": 38.0, \"strapColor\": \"Silver\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,145000000,145000000,0),(20,18,22,'{\"sku\": \"OMG-SPD-324.30.38\", \"name\": \"Omega Speedmaster 38\", \"brand\": \"Omega\", \"price\": 145000000, \"watchId\": 19, \"imageUrl\": \"\", \"dialColor\": \"White\", \"variantId\": 22, \"caseSizeMm\": 38.0, \"strapColor\": \"Silver\", \"strapMaterial\": \"STAINLESS_STEEL\"}',2,145000000,290000000,0),(21,19,22,'{\"sku\": \"OMG-SPD-324.30.38\", \"name\": \"Omega Speedmaster 38\", \"brand\": \"Omega\", \"price\": 145000000, \"watchId\": 19, \"imageUrl\": \"\", \"dialColor\": \"White\", \"variantId\": 22, \"caseSizeMm\": 38.0, \"strapColor\": \"Silver\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,145000000,145000000,0),(22,19,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"NYLON\"}',1,19990000,19990000,0),(23,19,38,'{\"sku\": \"APL-WS9-45-001\", \"name\": \"Apple Watch Series 9 45mm\", \"brand\": \"Apple\", \"price\": 9900000, \"watchId\": 31, \"imageUrl\": \"\", \"dialColor\": \"Xám\", \"variantId\": 38, \"caseSizeMm\": 45.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,9900000,9900000,0),(24,20,37,'{\"sku\": \"CAS-EFR550-001\", \"name\": \"Casio Edifice EFR-550\", \"brand\": \"Casio\", \"price\": 4200000, \"watchId\": 30, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364472/tawatch/watches/mbjp5zsy7n99adzg7gf7.jpg\", \"dialColor\": \"Đen\", \"variantId\": 37, \"caseSizeMm\": 45.0, \"strapColor\": \"Bạc\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,4200000,4200000,0),(25,21,35,'{\"sku\": \"CAS-GA100-001\", \"name\": \"Casio G-Shock GA-100\", \"brand\": \"Casio\", \"price\": 1800000, \"watchId\": 29, \"imageUrl\": \"\", \"dialColor\": \"Đen\", \"variantId\": 35, \"caseSizeMm\": 48.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,1800000,1800000,0),(26,22,37,'{\"sku\": \"CAS-EFR550-001\", \"name\": \"Casio Edifice EFR-550\", \"brand\": \"Casio\", \"price\": 4200000, \"watchId\": 30, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364472/tawatch/watches/mbjp5zsy7n99adzg7gf7.jpg\", \"dialColor\": \"Đen\", \"variantId\": 37, \"caseSizeMm\": 45.0, \"strapColor\": \"Bạc\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,4200000,4200000,0),(27,23,35,'{\"sku\": \"CAS-GA100-001\", \"name\": \"Casio G-Shock GA-100\", \"brand\": \"Casio\", \"price\": 1800000, \"watchId\": 29, \"imageUrl\": \"\", \"dialColor\": \"Đen\", \"variantId\": 35, \"caseSizeMm\": 48.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,1800000,1800000,0),(28,23,33,'{\"sku\": \"OMG-SPM-001\", \"name\": \"Omega Speedmaster Moonwatch\", \"brand\": \"Omega\", \"price\": 120000000, \"watchId\": 27, \"imageUrl\": \"\", \"dialColor\": \"Đen\", \"variantId\": 33, \"caseSizeMm\": 42.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"LEATHER\"}',2,120000000,240000000,0),(29,24,35,'{\"sku\": \"CAS-GA100-001\", \"name\": \"Casio G-Shock GA-100\", \"brand\": \"Casio\", \"price\": 1800000, \"watchId\": 29, \"imageUrl\": \"\", \"dialColor\": \"Đen\", \"variantId\": 35, \"caseSizeMm\": 48.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,1800000,1800000,0),(30,25,15,'{\"sku\": \"OMG-SM-210.30.42\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 150000000, \"watchId\": 12, \"imageUrl\": \"\", \"dialColor\": \"Blue\", \"variantId\": 15, \"caseSizeMm\": 42.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,150000000,150000000,0),(31,26,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"NYLON\"}',1,19990000,19990000,0),(32,27,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"NYLON\"}',1,19990000,19990000,0),(33,28,34,'{\"sku\": \"OMG-CONST-001\", \"name\": \"Omega Constellation\", \"brand\": \"Omega\", \"price\": 80000000, \"watchId\": 28, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364586/tawatch/watches/jsex5smasxqn8jl8e0qy.jpg\", \"dialColor\": \"Trắng\", \"variantId\": 34, \"caseSizeMm\": 28.0, \"strapColor\": \"Vàng\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,80000000,80000000,0),(34,29,14,'{\"sku\": \"RLX-SUB-124060\", \"name\": \"Rolex Submariner Date\", \"brand\": \"Rolex\", \"price\": 280000000, \"watchId\": 11, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781842537/tawatch/watches/uspmbhuq42asyq1dzngb.webp\", \"dialColor\": \"Black\", \"variantId\": 14, \"caseSizeMm\": 41.0, \"strapColor\": \"Black\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,280000000,280000000,0),(35,29,15,'{\"sku\": \"OMG-SM-210.30.42\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 150000000, \"watchId\": 12, \"imageUrl\": \"\", \"dialColor\": \"Blue\", \"variantId\": 15, \"caseSizeMm\": 42.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,150000000,150000000,0),(36,30,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"GOLD\"}',1,19990000,19990000,0),(37,30,37,'{\"sku\": \"CAS-EFR550-001\", \"name\": \"Casio Edifice EFR-550\", \"brand\": \"Casio\", \"price\": 4200000, \"watchId\": 30, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364472/tawatch/watches/mbjp5zsy7n99adzg7gf7.jpg\", \"dialColor\": \"Đen\", \"variantId\": 37, \"caseSizeMm\": 45.0, \"strapColor\": \"Bạc\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,4200000,4200000,0),(38,31,34,'{\"sku\": \"OMG-CONST-001\", \"name\": \"Omega Constellation\", \"brand\": \"Omega\", \"price\": 80000000, \"watchId\": 28, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364586/tawatch/watches/jsex5smasxqn8jl8e0qy.jpg\", \"dialColor\": \"Trắng\", \"variantId\": 34, \"caseSizeMm\": 28.0, \"strapColor\": \"Vàng\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,80000000,80000000,0),(39,31,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"GOLD\"}',1,19990000,19990000,0),(40,32,35,'{\"sku\": \"CAS-GA100-001\", \"name\": \"Casio G-Shock GA-100\", \"brand\": \"Casio\", \"price\": 1800000, \"watchId\": 29, \"imageUrl\": \"\", \"dialColor\": \"Đen\", \"variantId\": 35, \"caseSizeMm\": 48.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,1800000,1800000,0),(41,32,38,'{\"sku\": \"APL-WS9-45-001\", \"name\": \"Apple Watch Series 9 45mm\", \"brand\": \"Apple\", \"price\": 9900000, \"watchId\": 31, \"imageUrl\": \"\", \"dialColor\": \"Xám\", \"variantId\": 38, \"caseSizeMm\": 45.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,9900000,9900000,0),(42,33,4,'{\"sku\": \"OMG-SM-001\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 180000000, \"watchId\": 3, \"imageUrl\": \"https://example.com/omega-blue.jpg\", \"dialColor\": \"Xanh dương\", \"variantId\": 4, \"caseSizeMm\": 42.0, \"strapColor\": \"Bạc\", \"strapMaterial\": null}',1,180000000,180000000,0),(43,34,17,'{\"sku\": \"CSO-GWG-2000-1A3\", \"name\": \"Casio G-Shock Mudmaster\", \"brand\": \"Casio\", \"price\": 18000000, \"watchId\": 14, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887101/tawatch/watches/oz1ujfr0krvgcjwovge8.webp\", \"dialColor\": \"Black\", \"variantId\": 17, \"watchSlug\": \"casio-g-shock-mudmaster\", \"caseSizeMm\": 55.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,18000000,18000000,0),(44,34,23,'{\"sku\": \"SKO-SARB065\", \"name\": \"Seiko Cocktail Time\", \"brand\": \"Seiko\", \"price\": 8500000, \"watchId\": 20, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887855/tawatch/watches/ufx75jl1cmknv6njxzb4.webp\", \"dialColor\": \"Champagne\", \"variantId\": 23, \"watchSlug\": \"seiko-cocktail-time\", \"caseSizeMm\": 38.0, \"strapColor\": \"Brown\", \"strapMaterial\": \"LEATHER\"}',1,8500000,8500000,0),(45,35,15,'{\"sku\": \"OMG-SM-210.30.42\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 150000000, \"watchId\": 12, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781886929/tawatch/watches/yxqiwetasxoah8vkyitk.webp\", \"dialColor\": \"Blue\", \"variantId\": 15, \"watchSlug\": \"omega-seamaster-diver-300m\", \"caseSizeMm\": 42.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,150000000,150000000,0),(46,36,15,'{\"sku\": \"OMG-SM-210.30.42\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 150000000, \"watchId\": 12, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781886929/tawatch/watches/yxqiwetasxoah8vkyitk.webp\", \"dialColor\": \"Blue\", \"variantId\": 15, \"watchSlug\": \"omega-seamaster-diver-300m\", \"caseSizeMm\": 42.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,150000000,150000000,0),(47,36,38,'{\"sku\": \"APL-WS9-45-001\", \"name\": \"Apple Watch Series 9 45mm\", \"brand\": \"Apple\", \"price\": 9900000, \"watchId\": 31, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364449/tawatch/watches/vnjg1uu1pm9ztsakx6ha.jpg\", \"dialColor\": \"Xám\", \"variantId\": 38, \"watchSlug\": \"apple-watch-series-9-45mm\", \"caseSizeMm\": 45.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,9900000,9900000,0),(48,36,35,'{\"sku\": \"CAS-GA100-001\", \"name\": \"Casio G-Shock GA-100\", \"brand\": \"Casio\", \"price\": 1800000, \"watchId\": 29, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364549/tawatch/watches/alfhl99ysrepk1dudder.jpg\", \"dialColor\": \"Đen\", \"variantId\": 35, \"watchSlug\": \"casio-g-shock-ga-100\", \"caseSizeMm\": 48.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,1800000,1800000,0),(49,37,41,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 1222200, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Bạc\", \"variantId\": 41, \"watchSlug\": \"apple-watch-ultra-2\", \"caseSizeMm\": 12.0, \"strapColor\": \"Black\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,1222200,1222200,0),(50,38,31,'{\"sku\": \"OMG-SM300-001\", \"name\": \"Omega Seamaster 300\", \"brand\": \"Omega\", \"price\": 90000000, \"watchId\": 26, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782383265/tawatch/watches/q1eimhzmdmc1hthsbemr.jpg\", \"dialColor\": \"Đen\", \"variantId\": 31, \"watchSlug\": \"omega-seamaster-300\", \"caseSizeMm\": 42.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,90000000,90000000,0),(51,39,15,'{\"sku\": \"OMG-SM-210.30.42\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 150000000, \"watchId\": 12, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781886929/tawatch/watches/yxqiwetasxoah8vkyitk.webp\", \"dialColor\": \"Blue\", \"variantId\": 15, \"watchSlug\": \"omega-seamaster-diver-300m\", \"caseSizeMm\": 42.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,150000000,150000000,0),(52,40,14,'{\"sku\": \"RLX-SUB-124060\", \"name\": \"Rolex Submariner Date\", \"brand\": \"Rolex\", \"price\": 280000000, \"watchId\": 11, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781842537/tawatch/watches/uspmbhuq42asyq1dzngb.webp\", \"dialColor\": \"Black\", \"variantId\": 14, \"watchSlug\": \"rolex-submariner-date\", \"caseSizeMm\": 41.0, \"strapColor\": \"Black\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,280000000,280000000,0),(53,41,31,'{\"sku\": \"OMG-SM300-001\", \"name\": \"Omega Seamaster 300\", \"brand\": \"Omega\", \"price\": 90000000, \"watchId\": 26, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782383265/tawatch/watches/q1eimhzmdmc1hthsbemr.jpg\", \"dialColor\": \"Đen\", \"variantId\": 31, \"watchSlug\": \"omega-seamaster-300\", \"caseSizeMm\": 42.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,90000000,90000000,0),(54,41,18,'{\"sku\": \"TAG-CAR-CBN2A1A\", \"name\": \"TAG Heuer Carrera Chronograph\", \"brand\": \"TAG Heuer\", \"price\": 90000000, \"watchId\": 15, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887250/tawatch/watches/vqpduvpk82wkcoy02gga.webp\", \"dialColor\": \"Black\", \"variantId\": 18, \"watchSlug\": \"tag-heuer-carrera-chronograph\", \"caseSizeMm\": 44.0, \"strapColor\": \"Black\", \"strapMaterial\": \"LEATHER\"}',1,90000000,90000000,0),(55,41,15,'{\"sku\": \"OMG-SM-210.30.42\", \"name\": \"Omega Seamaster Diver 300M\", \"brand\": \"Omega\", \"price\": 150000000, \"watchId\": 12, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781886929/tawatch/watches/yxqiwetasxoah8vkyitk.webp\", \"dialColor\": \"Blue\", \"variantId\": 15, \"watchSlug\": \"omega-seamaster-diver-300m\", \"caseSizeMm\": 42.0, \"strapColor\": \"Black\", \"strapMaterial\": \"RUBBER\"}',1,150000000,150000000,0),(56,42,38,'{\"sku\": \"APL-WS9-45-001\", \"name\": \"Apple Watch Series 9 45mm\", \"brand\": \"Apple\", \"price\": 9900000, \"watchId\": 31, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364449/tawatch/watches/vnjg1uu1pm9ztsakx6ha.jpg\", \"dialColor\": \"Xám\", \"variantId\": 38, \"watchSlug\": \"apple-watch-series-9-45mm\", \"caseSizeMm\": 45.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,9900000,9900000,0),(57,42,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"watchSlug\": \"apple-watch-ultra-2\", \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"GOLD\"}',1,19990000,19990000,0),(58,43,37,'{\"sku\": \"CAS-EFR550-001\", \"name\": \"Casio Edifice EFR-550\", \"brand\": \"Casio\", \"price\": 4200000, \"watchId\": 30, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364472/tawatch/watches/mbjp5zsy7n99adzg7gf7.jpg\", \"dialColor\": \"Đen\", \"variantId\": 37, \"watchSlug\": \"casio-edifice-efr-550\", \"caseSizeMm\": 45.0, \"strapColor\": \"Bạc\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,4200000,4200000,0),(59,44,38,'{\"sku\": \"APL-WS9-45-001\", \"name\": \"Apple Watch Series 9 45mm\", \"brand\": \"Apple\", \"price\": 9900000, \"watchId\": 31, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364449/tawatch/watches/vnjg1uu1pm9ztsakx6ha.jpg\", \"dialColor\": \"Xám\", \"variantId\": 38, \"watchSlug\": \"apple-watch-series-9-45mm\", \"caseSizeMm\": 45.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"RUBBER\"}',1,9900000,9900000,0),(60,45,14,'{\"sku\": \"RLX-SUB-124060\", \"name\": \"Rolex Submariner Date\", \"brand\": \"Rolex\", \"price\": 280000000, \"watchId\": 11, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781842537/tawatch/watches/uspmbhuq42asyq1dzngb.webp\", \"dialColor\": \"Black\", \"variantId\": 14, \"watchSlug\": \"rolex-submariner-date\", \"caseSizeMm\": 41.0, \"strapColor\": \"Black\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,280000000,280000000,0),(61,46,41,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 1222200, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782375339/tawatch/watches/pix6qaxjthpxfrgjp420.jpg\", \"dialColor\": \"Bạc\", \"variantId\": 41, \"watchSlug\": \"apple-watch-ultra-2\", \"caseSizeMm\": 12.0, \"strapColor\": \"Black\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,1222200,1222200,0),(62,47,27,'{\"sku\": \"RLX-SUB-002\", \"name\": \"Rolex Submariner Date Women\", \"brand\": \"Rolex\", \"price\": 320000000, \"watchId\": 23, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364360/tawatch/watches/jpb0bkzacqhufwtirdh8.jpg\", \"dialColor\": \"Đen\", \"variantId\": 27, \"watchSlug\": \"rolex-submariner-date-women\", \"caseSizeMm\": 41.0, \"strapColor\": \"Bạc\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,320000000,320000000,0),(63,47,40,'{\"sku\": \"APL-WU2-001\", \"name\": \"Apple Watch Ultra 2\", \"brand\": \"Apple\", \"price\": 19990000, \"watchId\": 32, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg\", \"dialColor\": \"Đen\", \"variantId\": 40, \"watchSlug\": \"apple-watch-ultra-2\", \"caseSizeMm\": 49.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"GOLD\"}',1,19990000,19990000,0),(64,48,32,'{\"sku\": \"OMG-SM300-001\", \"name\": \"Omega Seamaster 300\", \"brand\": \"Omega\", \"price\": 92000000, \"watchId\": 26, \"imageUrl\": \"https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782383265/tawatch/watches/q1eimhzmdmc1hthsbemr.jpg\", \"dialColor\": null, \"variantId\": 32, \"watchSlug\": \"omega-seamaster-300\", \"caseSizeMm\": 42.0, \"strapColor\": \"Đen\", \"strapMaterial\": \"STAINLESS_STEEL\"}',1,92000000,92000000,64400000);
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
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `changed_by` int DEFAULT NULL COMMENT 'user.id của admin/staff thực hiện',
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_osh_order` (`order_id`),
  KEY `fk_osh_user` (`changed_by`),
  CONSTRAINT `fk_osh_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_osh_user` FOREIGN KEY (`changed_by`) REFERENCES `user` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
INSERT INTO `order_status_history` VALUES (27,17,'PENDING','Don hang moi duoc tao',NULL,'2026-06-20 09:23:10'),(28,17,'CONFIRMED',NULL,NULL,'2026-06-20 09:23:36'),(29,17,'PROCESSING',NULL,NULL,'2026-06-20 09:23:41'),(30,17,'SHIPPING',NULL,NULL,'2026-06-20 09:23:47'),(31,17,'DELIVERED',NULL,NULL,'2026-06-20 09:23:51'),(32,18,'PENDING','Don hang moi duoc tao',NULL,'2026-06-23 12:28:26'),(33,19,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 05:55:34'),(34,20,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 06:31:53'),(35,21,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 06:33:22'),(36,22,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 06:36:03'),(37,23,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 06:38:53'),(38,24,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 06:51:26'),(39,25,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 07:01:06'),(40,26,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 07:01:21'),(41,27,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 07:31:16'),(42,28,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 07:37:49'),(43,28,'CONFIRMED',NULL,NULL,'2026-06-25 08:10:25'),(44,28,'PROCESSING',NULL,NULL,'2026-06-25 08:10:30'),(45,28,'SHIPPING',NULL,NULL,'2026-06-25 08:10:32'),(46,28,'DELIVERED',NULL,NULL,'2026-06-25 08:10:33'),(47,27,'CONFIRMED',NULL,NULL,'2026-06-25 08:10:35'),(48,27,'PROCESSING',NULL,NULL,'2026-06-25 08:10:35'),(49,27,'SHIPPING',NULL,NULL,'2026-06-25 08:10:35'),(50,27,'DELIVERED',NULL,NULL,'2026-06-25 08:10:35'),(51,26,'CONFIRMED',NULL,NULL,'2026-06-25 08:10:38'),(52,26,'PROCESSING',NULL,NULL,'2026-06-25 08:10:38'),(53,26,'SHIPPING',NULL,NULL,'2026-06-25 08:10:39'),(54,26,'DELIVERED',NULL,NULL,'2026-06-25 08:10:39'),(55,24,'CONFIRMED',NULL,NULL,'2026-06-25 08:10:46'),(56,24,'PROCESSING',NULL,NULL,'2026-06-25 08:10:46'),(57,24,'SHIPPING',NULL,NULL,'2026-06-25 08:10:46'),(58,24,'DELIVERED',NULL,NULL,'2026-06-25 08:10:46'),(59,21,'CONFIRMED',NULL,NULL,'2026-06-25 08:10:50'),(60,21,'PROCESSING',NULL,NULL,'2026-06-25 08:10:51'),(61,21,'SHIPPING',NULL,NULL,'2026-06-25 08:10:51'),(62,21,'DELIVERED',NULL,NULL,'2026-06-25 08:10:51'),(63,29,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 12:45:39'),(64,30,'PENDING','Don hang moi duoc tao',NULL,'2026-06-25 12:52:14'),(65,31,'PENDING','Don hang moi duoc tao',NULL,'2026-06-29 06:50:38'),(66,32,'PENDING','Don hang moi duoc tao',NULL,'2026-06-29 09:44:30'),(67,32,'CONFIRMED',NULL,NULL,'2026-06-29 09:45:17'),(68,32,'PROCESSING',NULL,NULL,'2026-06-29 09:45:19'),(69,32,'SHIPPING',NULL,NULL,'2026-06-29 09:45:19'),(70,32,'DELIVERED',NULL,NULL,'2026-06-29 09:45:19'),(71,31,'CONFIRMED',NULL,NULL,'2026-06-29 09:45:33'),(72,31,'PROCESSING',NULL,NULL,'2026-06-29 09:45:33'),(73,31,'SHIPPING',NULL,NULL,'2026-06-29 09:45:34'),(74,31,'DELIVERED',NULL,NULL,'2026-06-29 09:45:36'),(75,33,'PENDING','Don hang moi duoc tao',NULL,'2026-06-29 09:47:34'),(76,33,'CONFIRMED',NULL,NULL,'2026-06-29 09:47:46'),(77,33,'PROCESSING',NULL,NULL,'2026-06-29 09:47:47'),(78,33,'SHIPPING',NULL,NULL,'2026-06-29 09:47:47'),(79,33,'DELIVERED',NULL,NULL,'2026-06-29 09:47:47'),(80,30,'CONFIRMED',NULL,NULL,'2026-07-01 07:21:11'),(81,34,'PENDING','Don hang moi duoc tao',NULL,'2026-08-03 10:54:18'),(82,35,'PENDING','Don hang moi duoc tao',NULL,'2026-08-03 11:58:53'),(83,36,'PENDING','Don hang moi duoc tao',NULL,'2026-08-03 11:59:22'),(84,37,'PENDING','Don hang moi duoc tao',NULL,'2026-08-03 11:59:37'),(85,38,'PENDING','Don hang moi duoc tao',NULL,'2026-08-03 11:59:53'),(86,39,'PENDING','Don hang moi duoc tao',NULL,'2026-08-03 12:15:54'),(87,39,'CONFIRMED',NULL,NULL,'2026-08-06 13:03:46'),(88,39,'PROCESSING',NULL,NULL,'2026-08-06 13:03:57'),(89,39,'SHIPPING',NULL,NULL,'2026-08-06 13:03:59'),(90,39,'DELIVERED',NULL,NULL,'2026-08-06 13:04:42'),(91,40,'PENDING','Don hang moi duoc tao',NULL,'2026-08-06 13:34:51'),(92,41,'PENDING','Don hang moi duoc tao',NULL,'2026-08-06 14:54:46'),(93,38,'CONFIRMED',NULL,NULL,'2026-08-06 15:44:36'),(94,38,'PROCESSING',NULL,NULL,'2026-08-07 02:29:52'),(95,38,'SHIPPING',NULL,NULL,'2026-08-07 02:29:54'),(96,38,'DELIVERED',NULL,NULL,'2026-08-07 02:29:56'),(97,42,'PENDING','Don hang moi duoc tao',NULL,'2026-08-07 02:39:17'),(98,30,'PROCESSING',NULL,NULL,'2026-08-07 02:41:23'),(99,30,'SHIPPING',NULL,NULL,'2026-08-07 02:41:24'),(100,30,'DELIVERED',NULL,NULL,'2026-08-07 02:41:28'),(101,19,'CONFIRMED',NULL,NULL,'2026-08-07 02:41:40'),(102,19,'PROCESSING',NULL,NULL,'2026-08-07 02:41:41'),(103,19,'SHIPPING',NULL,NULL,'2026-08-07 02:41:43'),(104,19,'DELIVERED',NULL,NULL,'2026-08-07 02:41:45'),(105,32,'RETURN_REQUESTED','Yêu cầu đổi/trả: Hang loi',22,'2026-08-07 02:42:17'),(106,40,'CANCELLED','Tao ko thich',NULL,'2026-08-07 04:55:05'),(107,43,'PENDING','Don hang moi duoc tao',NULL,'2026-08-07 04:57:29'),(108,32,'REFUNDED',NULL,NULL,'2026-08-07 05:17:30'),(109,21,'RETURN_REQUESTED','Yêu cầu đổi/trả: Toi khong thich',1,'2026-08-07 05:27:46'),(110,21,'REFUNDED',NULL,NULL,'2026-08-07 05:28:02'),(111,44,'PENDING','Don hang moi duoc tao',NULL,'2026-08-07 05:41:59'),(112,45,'PENDING','Don hang moi duoc tao',NULL,'2026-08-07 05:51:14'),(113,46,'PENDING','Don hang moi duoc tao',NULL,'2026-08-07 05:54:58'),(114,46,'PROCESSING',NULL,NULL,'2026-08-07 08:36:28'),(115,46,'SHIPPING',NULL,NULL,'2026-08-07 08:36:31'),(116,46,'DELIVERED',NULL,NULL,'2026-08-07 08:36:32'),(117,47,'PENDING','Don hang moi duoc tao',NULL,'2026-08-08 06:44:48'),(118,47,'CONFIRMED',NULL,NULL,'2026-08-08 08:27:26'),(119,45,'CONFIRMED',NULL,NULL,'2026-08-08 08:43:57'),(120,45,'PROCESSING',NULL,NULL,'2026-08-08 08:44:00'),(121,47,'CANCELLED','Khong tu tin',NULL,'2026-08-08 09:01:55'),(122,45,'SHIPPING',NULL,NULL,'2026-08-08 09:02:30'),(123,45,'DELIVERED',NULL,NULL,'2026-08-08 09:02:31'),(124,41,'CONFIRMED',NULL,NULL,'2026-08-10 12:55:03'),(125,41,'PROCESSING',NULL,NULL,'2026-08-10 12:55:05'),(126,41,'SHIPPING',NULL,NULL,'2026-08-10 12:55:06'),(127,42,'CONFIRMED',NULL,NULL,'2026-08-10 13:03:34'),(128,42,'PROCESSING',NULL,NULL,'2026-08-10 13:03:36'),(129,42,'SHIPPING',NULL,NULL,'2026-08-10 13:03:37'),(130,48,'PENDING','Don hang moi duoc tao',NULL,'2026-08-10 13:06:05'),(131,48,'CONFIRMED',NULL,NULL,'2026-08-10 13:06:16'),(132,48,'PROCESSING',NULL,NULL,'2026-08-10 13:06:18'),(133,48,'SHIPPING',NULL,NULL,'2026-08-10 13:06:29'),(134,48,'DELIVERED',NULL,NULL,'2026-08-10 13:13:33'),(135,44,'PROCESSING',NULL,NULL,'2026-08-10 13:13:35'),(136,44,'SHIPPING',NULL,NULL,'2026-08-10 13:13:36');
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
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp_code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã OTP 6 số',
  `purpose` enum('CHANGE_EMAIL','RESET_PASSWORD','VERIFY_EMAIL') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT '0',
  `attempts` tinyint NOT NULL DEFAULT '0' COMMENT 'Số lần nhập sai, tối đa 5',
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_otp_email` (`email`),
  KEY `idx_otp_expires` (`expires_at`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_verification`
--

LOCK TABLES `otp_verification` WRITE;
/*!40000 ALTER TABLE `otp_verification` DISABLE KEYS */;
INSERT INTO `otp_verification` VALUES (1,'anhtuhungdeveloper@gmail.com','331804','VERIFY_EMAIL',0,0,'2026-05-27 14:14:48','2026-05-27 14:09:48'),(2,'quyvo2079@gmail.com','653599','VERIFY_EMAIL',1,0,'2026-05-27 14:17:10','2026-05-27 14:12:10'),(3,'quyvo2079@gmail.com','017714','VERIFY_EMAIL',1,0,'2026-05-27 14:19:38','2026-05-27 14:14:38'),(4,'quyvo2079@gmail.com','869921','VERIFY_EMAIL',1,0,'2026-05-27 14:23:35','2026-05-27 14:18:35'),(5,'quyvo2079@gmail.com','171566','VERIFY_EMAIL',1,0,'2026-05-27 14:31:18','2026-05-27 14:26:18'),(6,'vothienphu113@gmail.com','113074','VERIFY_EMAIL',0,0,'2026-05-27 14:33:15','2026-05-27 14:28:15'),(7,'quyvo2079@gmail.com','229881','VERIFY_EMAIL',1,0,'2026-05-27 14:44:05','2026-05-27 14:39:05'),(8,'quyvo2079@gmail.com','671292','RESET_PASSWORD',1,0,'2026-06-13 05:42:03','2026-06-13 05:37:03'),(9,'quyvo2079@gmail.com','463825','RESET_PASSWORD',1,0,'2026-06-13 05:52:57','2026-06-13 05:47:57'),(10,'quyvo2079@gmail.com','846185','RESET_PASSWORD',1,0,'2026-07-01 13:22:18','2026-07-01 13:17:18'),(11,'quyvo2079@gmail.com','444241','RESET_PASSWORD',1,0,'2026-08-06 15:16:28','2026-08-06 15:11:28');
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
  `transaction_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã giao dịch từ cổng thanh toán',
  `gateway` enum('BANK_TRANSFER','COD','VNPAY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(15,0) NOT NULL,
  `status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `response_data` json DEFAULT NULL COMMENT 'Raw response từ VNPay IPN',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_code` (`transaction_code`),
  KEY `fk_pt_order` (`order_id`),
  CONSTRAINT `fk_pt_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transaction`
--

LOCK TABLES `payment_transaction` WRITE;
/*!40000 ALTER TABLE `payment_transaction` DISABLE KEYS */;
INSERT INTO `payment_transaction` VALUES (14,19,'VNPAY-DA697280BAF644F5','VNPAY',174919001,'PENDING','{\"orderId\": \"ORD-20260625-933967\", \"createDate\": \"20260625125534\"}','2026-06-25 05:55:34','2026-06-25 05:55:34'),(15,20,'VNPAY-C886AC2446D7468D','VNPAY',4239001,'PENDING','{\"orderId\": \"ORD-20260625-112848\", \"createDate\": \"20260625133153\"}','2026-06-25 06:31:53','2026-06-25 06:31:53'),(16,21,'VNPAY-7845ACC54D984A36','VNPAY',1839001,'PENDING','{\"orderId\": \"ORD-20260625-202090\", \"createDate\": \"20260625133322\"}','2026-06-25 06:33:22','2026-06-25 06:33:22'),(17,22,'VNPAY-7945D312585D49AA','VNPAY',4239001,'PENDING','{\"orderId\": \"ORD-20260625-362633\", \"createDate\": \"20260625133602\"}','2026-06-25 06:36:03','2026-06-25 06:36:03'),(18,23,'VNPAY-FB28D4BDC3164E1A','VNPAY',241829001,'PENDING','{\"orderId\": \"ORD-20260625-533000\", \"createDate\": \"20260625133853\"}','2026-06-25 06:38:53','2026-06-25 06:38:53'),(19,24,'VNPAY-AC3DAECA8BF04B3B','VNPAY',1829001,'PENDING','{\"orderId\": \"ORD-20260625-286375\", \"createDate\": \"20260625135126\"}','2026-06-25 06:51:26','2026-06-25 06:51:26'),(20,26,'VNPAY-B1F44EA45EEB4132','VNPAY',20019001,'PENDING','{\"orderId\": \"ORD-20260625-880697\", \"createDate\": \"20260625140120\"}','2026-06-25 07:01:21','2026-06-25 07:01:21'),(21,27,'VNPAY-40FB61262312442A','VNPAY',20019001,'PENDING','{\"orderId\": \"ORD-20260625-675959\", \"createDate\": \"20260625143116\"}','2026-06-25 07:31:16','2026-06-25 07:31:16'),(22,28,'VNPAY-2A237B334F3A4B00','VNPAY',80029001,'COMPLETED','{\"vnp_Amount\": \"8002900100\", \"vnp_TxnRef\": \"VNPAY-2A237B334F3A4B00\", \"vnp_PayDate\": \"20260625143853\", \"vnp_TmnCode\": \"P3E33OY0\", \"vnp_BankCode\": \"NCB\", \"vnp_CardType\": \"ATM\", \"vnp_OrderInfo\": \"Thanh toan don hang ORD-20260625-068878\", \"vnp_BankTranNo\": \"VNP15598577\", \"vnp_SecureHash\": \"98b0c58f0183e55abcb2ae9f94076a0bc930134ad967f3e138ebf84d859cf56b92f336fc0ca567c9f330b324123c4b290ee8bffd6af602ea8bd9809d87ee07b2\", \"vnp_ResponseCode\": \"00\", \"vnp_TransactionNo\": \"15598577\", \"vnp_TransactionStatus\": \"00\"}','2026-06-25 07:37:49','2026-06-25 07:39:03'),(23,29,'VNPAY-93A8BB13CB2C4994','VNPAY',430029001,'PENDING','{\"orderId\": \"ORD-20260625-538410\", \"createDate\": \"20260625194538\"}','2026-06-25 12:45:39','2026-06-25 12:45:39'),(24,31,'VNPAY-4109F4BE527B466B','VNPAY',100019001,'COMPLETED','{\"vnp_Amount\": \"10001900100\", \"vnp_TxnRef\": \"VNPAY-4109F4BE527B466B\", \"vnp_PayDate\": \"20260629135146\", \"vnp_TmnCode\": \"P3E33OY0\", \"vnp_BankCode\": \"NCB\", \"vnp_CardType\": \"ATM\", \"vnp_OrderInfo\": \"Thanh toan don hang ORD-20260629-838049\", \"vnp_BankTranNo\": \"VNP15602912\", \"vnp_SecureHash\": \"146b445f4ddbfe1ba33c82e331408677efb1e31d82336043fc21456ba87cb95c5b0bc0cbf3641145d1672d332830560f7d06ef425aa5283d3df1461f1ff401f4\", \"vnp_ResponseCode\": \"00\", \"vnp_TransactionNo\": \"15602912\", \"vnp_TransactionStatus\": \"00\"}','2026-06-29 06:50:38','2026-06-29 06:51:52'),(25,35,'VNPAY-F03F0C02C1B1442F','VNPAY',148104500,'PENDING','{\"orderId\": \"ORD-20260803-332817\", \"createDate\": \"20260803185853\"}','2026-08-03 11:58:53','2026-08-03 11:58:53'),(26,38,'VNPAY-3C048858286A4C52','VNPAY',88293500,'PENDING','{\"orderId\": \"ORD-20260803-393431\", \"createDate\": \"20260803185953\"}','2026-08-03 11:59:54','2026-08-03 11:59:54'),(27,39,'VNPAY-D7C4104220AB43A7','VNPAY',150104500,'PENDING','{\"orderId\": \"ORD-20260803-353578\", \"createDate\": \"20260803191553\"}','2026-08-03 12:15:54','2026-08-03 12:15:54'),(28,40,'VNPAY-D7AB65580DB04E3F','VNPAY',278000000,'PENDING','{\"orderId\": \"ORD-20260806-290441\", \"createDate\": \"20260806203450\"}','2026-08-06 13:34:51','2026-08-06 13:34:51'),(29,41,'VNPAY-2EC01EEDC02341A9','VNPAY',330104500,'PENDING','{\"orderId\": \"ORD-20260806-085815\", \"createDate\": \"20260806215446\"}','2026-08-06 14:54:46','2026-08-06 14:54:46'),(30,42,'VNPAY-AD4EAF634B3049AE','VNPAY',27862600,'PENDING','{\"orderId\": \"ORD-20260807-357193\", \"createDate\": \"20260807093917\"}','2026-08-07 02:39:17','2026-08-07 02:39:17'),(31,43,'VNPAY-7FC319E1C0C1452F','VNPAY',4220500,'COMPLETED','{\"vnp_Amount\": \"422050000\", \"vnp_TxnRef\": \"VNPAY-7FC319E1C0C1452F\", \"vnp_PayDate\": \"20260807115752\", \"vnp_TmnCode\": \"5CAIYY68\", \"vnp_BankCode\": \"NCB\", \"vnp_CardType\": \"ATM\", \"vnp_OrderInfo\": \"Thanh toan don hang ORD-20260807-649106\", \"vnp_BankTranNo\": \"VNP15649279\", \"vnp_SecureHash\": \"a81d49b6a0cdadf1b1632b1acccb1345899ff29cac13f3726de085366b4e94cc2e0e18e6a1b69439c6656a988c21e04ceda757ee38a32c3fb10aa3148c16b509\", \"vnp_ResponseCode\": \"00\", \"vnp_TransactionNo\": \"15649279\", \"vnp_TransactionStatus\": \"00\"}','2026-08-07 04:57:29','2026-08-07 04:57:59'),(32,44,'VNPAY-655BB725A71C4EF7','VNPAY',9806500,'PENDING','{\"orderId\": \"ORD-20260807-318739\", \"createDate\": \"20260807124158\"}','2026-08-07 05:41:59','2026-08-07 05:41:59'),(33,45,'VNPAY-7D2410A5B2B64FA0','VNPAY',274504500,'PENDING','{\"orderId\": \"ORD-20260807-873512\", \"createDate\": \"20260807125113\"}','2026-08-07 05:51:14','2026-08-07 05:51:14'),(34,46,'VNPAY-944D7FE520894613','VNPAY',1302256,'PENDING','{\"orderId\": \"ORD-20260807-098251\", \"createDate\": \"20260807125458\"}','2026-08-07 05:54:58','2026-08-07 05:54:58'),(35,46,'VNPAY-B7926E3239614E53','VNPAY',1302256,'PENDING','{\"orderId\": \"ORD-20260807-098251\", \"createDate\": \"20260807130008\"}','2026-08-07 06:00:09','2026-08-07 06:00:09'),(36,44,'VNPAY-2739E65492D94C31','VNPAY',9806500,'COMPLETED','{\"vnp_Amount\": \"980650000\", \"vnp_TxnRef\": \"VNPAY-2739E65492D94C31\", \"vnp_PayDate\": \"20260807130144\", \"vnp_TmnCode\": \"5CAIYY68\", \"vnp_BankCode\": \"NCB\", \"vnp_CardType\": \"ATM\", \"vnp_OrderInfo\": \"Thanh toan don hang ORD-20260807-318739\", \"vnp_BankTranNo\": \"VNP15649317\", \"vnp_SecureHash\": \"a6a4823899b95ee2503b4443add1c6632328209097e39b136b7f79328881e7a6de6e8fa14f141c7e17f6017d8c99c42c99039f2e572de882eb40c1d35be50582\", \"vnp_ResponseCode\": \"00\", \"vnp_TransactionNo\": \"15649317\", \"vnp_TransactionStatus\": \"00\"}','2026-08-07 06:00:56','2026-08-07 06:01:50'),(37,46,'VNPAY-F1E61D589ED1438C','VNPAY',1302256,'COMPLETED','{\"vnp_Amount\": \"130225600\", \"vnp_TxnRef\": \"VNPAY-F1E61D589ED1438C\", \"vnp_PayDate\": \"20260807130231\", \"vnp_TmnCode\": \"5CAIYY68\", \"vnp_BankCode\": \"NCB\", \"vnp_CardType\": \"ATM\", \"vnp_OrderInfo\": \"Thanh toan don hang ORD-20260807-098251\", \"vnp_BankTranNo\": \"VNP15649319\", \"vnp_SecureHash\": \"e568727984c480543d609351e09737539f4046daf5709ca34ec10af112068ae7c7fdd971eb3f25111cc264c0b5179c09ea6834b56b00301e33c09d2f223b289f\", \"vnp_ResponseCode\": \"00\", \"vnp_TransactionNo\": \"15649319\", \"vnp_TransactionStatus\": \"00\"}','2026-08-07 06:02:17','2026-08-07 06:02:36');
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
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `promo_type` enum('PRODUCT','ORDER','CATEGORY','BRAND') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('PERCENT','FIXED_AMOUNT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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
  `watch_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_promo_variant` (`watch_variant_id`),
  KEY `idx_promotion_dates` (`start_date`,`end_date`),
  KEY `FKek1e7tkku4q1yty54sq9r7dmr` (`watch_id`),
  CONSTRAINT `fk_promo_variant` FOREIGN KEY (`watch_variant_id`) REFERENCES `watch_variant` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FKek1e7tkku4q1yty54sq9r7dmr` FOREIGN KEY (`watch_id`) REFERENCES `watch` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
INSERT INTO `promotion` VALUES (12,'VUI VE','ORDER','PERCENT',10.00,0,NULL,NULL,0,0,NULL,0,'2026-06-20 07:53:00','2027-06-05 07:53:00',1,'2026-06-20 07:55:16',NULL),(13,'Khuyến Mãi Gây Sốc 10% cho các sản phẩm đặc biệt','PRODUCT','PERCENT',10.00,0,NULL,NULL,0,0,NULL,0,'2026-06-23 06:51:00','2026-06-30 06:51:00',1,'2026-06-23 07:16:35',NULL),(14,'Chuong trinh khuyen mai','PRODUCT','PERCENT',5.00,5000000,2000000,20,5,0,NULL,0,'2026-08-03 02:31:00','2026-08-21 09:30:00',1,'2026-08-03 09:42:47',NULL),(15,'Choi','ORDER','PERCENT',20.00,0,NULL,NULL,1,0,NULL,0,'2026-08-08 06:42:00','2026-08-15 06:42:00',1,'2026-08-08 06:43:16',NULL);
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_watch`
--

DROP TABLE IF EXISTS `promotion_watch`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_watch` (
  `promotion_id` int NOT NULL,
  `watch_id` int NOT NULL,
  PRIMARY KEY (`promotion_id`,`watch_id`),
  KEY `FK7by54h6ayhs00ycnn4lp6ftn4` (`watch_id`),
  CONSTRAINT `FK7by54h6ayhs00ycnn4lp6ftn4` FOREIGN KEY (`watch_id`) REFERENCES `watch` (`id`),
  CONSTRAINT `FKsksmj5xe9wq107yqnnn443e7i` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_watch`
--

LOCK TABLES `promotion_watch` WRITE;
/*!40000 ALTER TABLE `promotion_watch` DISABLE KEYS */;
INSERT INTO `promotion_watch` VALUES (13,10),(13,11),(14,11),(13,12),(14,12),(14,14),(13,18),(13,19),(14,20);
/*!40000 ALTER TABLE `promotion_watch` ENABLE KEYS */;
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
  `token_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SHA-256 của token thực',
  `device_info` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'User-Agent / tên thiết bị',
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `condition_note` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `reason` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','COMPLETED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `refund_method` enum('COD_REFUND','VNPAY_REFUND','STORE_CREDIT') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `refund_amount` decimal(15,0) DEFAULT NULL,
  `admin_note` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
  `comment` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (2,22,19,17,4,'Dep lam, chuc shop vui ve hanh phuc',1,'2026-06-20 09:29:07'),(3,23,32,27,5,'TUi thich lam',1,'2026-06-25 08:11:33'),(4,23,32,26,5,'ok love',1,'2026-06-25 08:12:00'),(6,23,28,31,5,'qưe',1,'2026-08-06 17:44:48'),(7,23,32,31,5,'Love u',1,'2026-08-06 17:47:49'),(8,1,12,39,5,'tot',1,'2026-08-07 08:39:44');
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivery_method` enum('EXTERNAL_SHIPPER','DIRECT_SHOP') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EXTERNAL_SHIPPER',
  `slug` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_segment_slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `segment`
--

LOCK TABLES `segment` WRITE;
/*!40000 ALTER TABLE `segment` DISABLE KEYS */;
INSERT INTO `segment` VALUES (1,'Bình dân','EXTERNAL_SHIPPER',NULL),(2,'Trung cấp','EXTERNAL_SHIPPER',NULL),(3,'Luxury','DIRECT_SHOP',NULL),(4,'Siêu cao cấp','EXTERNAL_SHIPPER','sieu-cao-cap'),(5,'Cao cấp','EXTERNAL_SHIPPER','cao-cap'),(6,'Tầm trung','EXTERNAL_SHIPPER','tam-trung');
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
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_endpoint` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `api_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
-- Table structure for table `store_settings`
--

DROP TABLE IF EXISTS `store_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `store_settings` (
  `id` bigint NOT NULL,
  `address` varchar(500) DEFAULT NULL,
  `default_shipping_fee` decimal(15,0) DEFAULT NULL,
  `free_shipping_threshold` decimal(15,0) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `store_name` varchar(200) DEFAULT NULL,
  `support_email` varchar(200) DEFAULT NULL,
  `website` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `store_settings`
--

LOCK TABLES `store_settings` WRITE;
/*!40000 ALTER TABLE `store_settings` DISABLE KEYS */;
INSERT INTO `store_settings` VALUES (1,'123 Nguyễn Huệ, Quận 1, TP.HCM',30000,2000000,'028 3822 1234','TAWatch','quyvo2079@gmail.com','tawatch.vn');
/*!40000 ALTER TABLE `store_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supplier` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'Dong HO lon nhat vietnam','dh@gmail.com','0123456789','133/5 ap 15 xa Hiep Phuoc TP HCM',1,'2026-06-24 12:43:28','2026-08-06 14:01:24'),(2,'cong ty dong ho','D@Ggmail.com','0123456789','123',1,'2026-08-07 08:40:57','2026-08-07 08:40:57');
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
INSERT INTO `supplier_brand` VALUES (1,1),(2,1),(1,2),(2,2),(1,3),(1,7),(2,7),(1,8),(1,9),(1,10),(1,11);
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
  `username` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'NULL nếu đăng nhập Google',
  `full_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `auth_provider` enum('LOCAL','GOOGLE') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'LOCAL',
  `google_id` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Sub từ Google OAuth',
  `role` enum('CUSTOMER','ADMIN','STAFF') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
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
INSERT INTO `user` VALUES (1,'admin','admin@gmail.com','$2a$10$jX4kka9ExaNQIjhl0lmBTOC3HG22JoEPW6HIf/yvH5ySrgr4TAMfC','Admin',NULL,NULL,'LOCAL',NULL,'ADMIN',0,1,1,'2026-05-27 08:31:41','2026-05-27 08:31:41'),(4,'DH52201225','dh52201225@student.stu.edu.vn','$2a$10$.v0sLXealqdijWiqU8BlXe1vf04qhfOi6GW4tJ06.pLi06S3LAfwm','Vo Thien Phu','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',2,1,0,'2026-05-27 11:29:28','2026-05-27 11:29:28'),(5,'axller','vtp15360@gmail.com','$2a$10$8r.AcoVt4IMYRWUqjcvD6eKr0UntmECkUdmwgsNgpsH8Vy.0IfD8O','Vo Thien Phu','0123456789','2007-12-12','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:35:03','2026-05-27 11:35:03'),(6,'quyvo2079@gmail.com','vtp113@gmail.com','$2a$10$mMyZmKYAPrKyeU1mpOJkvOMO9ADn0AsA6MsQVA0GJ8l12lOSyWQ3y','Vo Thien Phu','0123456789','2004-12-13','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:40:00','2026-05-27 11:40:00'),(7,'ades','vothienphu114@gmail.com','$2a$10$rLqrZ6P7AdqTOqWfym.G2.y8ZL17Nn5f7M0ADXDXUWpoc6LmV4j2e','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:41:26','2026-05-27 11:41:26'),(9,'adesee','vothienphu115@gmail.com','$2a$10$OGcPwsA.2QcxKMMk2EsoRukTW8c92MFwkaWjDF5w5xHv2fR8tsGhW','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:45:02','2026-05-27 11:45:02'),(11,'adeseeee','vothienphu116@gmail.com','$2a$10$kAWGECYpkApRVKTz.tQzzOTZ71fApCFWm.n84DxFentBVCFoqXnka','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:45:19','2026-05-27 11:45:19'),(12,'aáđâsdà','vothienphu117@gmail.com','$2a$10$USJj7tGmprcPhLt.miWiI.Bkyr3guDUu0e/M7cYqAIlEqF6CJaVAC','awđasa','0123456789','2004-02-02','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:45:31','2026-05-27 11:45:31'),(13,'vothienphu777','anhtuhungdeveloper@gmail.com','$2a$10$P/AISue1/RLMOYGvAWUx5eVfh1zXoAuiHodr18gULmvZI.KZzm5Ki','Vo Thien Phu','0123456789','2000-02-12','LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 11:46:19','2026-05-27 11:46:19'),(16,'otptest99','otptest99@test.com','$2a$10$IJuTEHwIa.sjOG2wHAgJEerkucPtQfMVxLRBTD2GmdF5E5wkCN5c2','OTP Test',NULL,NULL,'LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-27 12:13:16','2026-05-27 12:13:16'),(22,'vothienphu31313','vothienphu113@gmail.com','$2a$10$US6N/MUyPSCZbD3p1aaho.TQUmc2q1p1mpXIPz3hDejKwmNyeSqHG','alexander hungdodaide','0123456789','2004-01-02','GOOGLE','108379005373543366333','STAFF',2,1,1,'2026-05-27 14:28:15','2026-08-08 05:48:19'),(23,'VTP1225','quyvo2079@gmail.com','$2a$10$LMD2QDhycVAdqKaeQAhamugZ3rh7rDoqYRvQrTqfy46UnpqIvnXpa','Vo Thien Phu','0123456789','2004-02-02','GOOGLE','100783125340557168080','ADMIN',2,1,1,'2026-05-27 14:39:05','2026-08-06 15:12:04'),(24,'HTTP','truuonghoangbaodang3@gmail.com','$2a$10$Cust1EzvXDo9gmIBjYYVt.Q185YcpNmKbNS0ueug1QtndIOZ5cHSS','BAO DANG','0123456789',NULL,'LOCAL',NULL,'CUSTOMER',0,1,0,'2026-05-28 15:08:35','2026-05-28 15:08:35');
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
  `recipient_name` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_detail` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `ghn_district_id` int DEFAULT NULL,
  `ghn_ward_code` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ua_user` (`user_id`),
  CONSTRAINT `fk_ua_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_address`
--

LOCK TABLES `user_address` WRITE;
/*!40000 ALTER TABLE `user_address` DISABLE KEYS */;
INSERT INTO `user_address` VALUES (4,22,'Võ Thiên Phú','03999888999','231/10 Ấp3','Hồ Chí Minh','Huyện Nhà Bè','Xã Hiệp Phước',1,1534,'22302'),(6,1,'TP','0123456789','235','Hưng Yên','Huyện Văn Lâm','Xã Chỉ Đạo',1,2046,'220902'),(7,4,'VTP','020202022','123','Hòa Bình','Huyện Kỳ Sơn','Xã Dân Hạ',1,1955,'230602'),(8,23,'Vo Thien Phu','0388848089','231/5','Hòa Bình','Huyện Lạc Thủy','Thị trấn Thanh Hà',1,2157,'230902'),(9,22,'nn','0906632044','231/5','Lào Cai','Huyện Mường Khương','Xã Bản Lầu',0,2171,'80902');
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
  `sku` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `brand_id` int NOT NULL,
  `category_id` int NOT NULL,
  `segment_id` int NOT NULL,
  `description` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `movement_type` enum('AUTOMATIC','MANUAL','QUARTZ','SOLAR','SMART') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `glass_material` enum('ACRYLIC','HARDLEX','MINERAL','SAPPHIRE','SAPPHIRE_COATED') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `thickness_mm` decimal(5,2) DEFAULT NULL COMMENT 'Độ dày (mm)',
  `water_resistance_atm` decimal(5,1) DEFAULT NULL COMMENT 'Chống nước (ATM)',
  `power_reserve_hours` int DEFAULT NULL COMMENT 'Khoảng trữ cót (giờ)',
  `battery_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Loại pin nếu là quartz',
  `features` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `slug` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_featured` bit(1) NOT NULL DEFAULT b'0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  UNIQUE KEY `uk_watch_slug` (`slug`),
  KEY `idx_watch_brand` (`brand_id`),
  KEY `idx_watch_segment` (`segment_id`),
  KEY `idx_watch_category` (`category_id`),
  CONSTRAINT `fk_w_brand` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  CONSTRAINT `fk_w_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `fk_w_segment` FOREIGN KEY (`segment_id`) REFERENCES `segment` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch`
--

LOCK TABLES `watch` WRITE;
/*!40000 ALTER TABLE `watch` DISABLE KEYS */;
INSERT INTO `watch` VALUES (2,'CAS-GS-001','Casio G-Shock GA-2100',2,6,1,'Mẫu G-Shock chống sốc nổi tiếng','QUARTZ','MINERAL',11.80,20.0,NULL,'SR726W','Chống sốc, giờ thế giới, đèn LED',0,'2026-05-27 08:36:10','2026-06-15 11:45:04','casio-g-shock-ga-2100',_binary '\0'),(3,'OMG-SM-001','Omega Seamaster Diver 300M',3,7,3,'Đồng hồ lặn cao cấp Omega','AUTOMATIC','SAPPHIRE',13.60,30.0,55,NULL,'Helium valve, dạ quang',0,'2026-05-27 08:36:10','2026-06-15 11:33:10',NULL,_binary '\0'),(4,'APL-WT-001','Apple Watch Series 9',4,11,2,'Đồng hồ thông minh Apple','SMART',NULL,10.70,5.0,NULL,NULL,'Heart Rate, GPS, Siri, Fitness',0,'2026-05-27 08:36:10','2026-06-15 11:49:54',NULL,_binary '\0'),(7,'m','m',1,5,1,NULL,'MANUAL',NULL,NULL,NULL,NULL,NULL,NULL,0,'2026-06-05 05:15:40','2026-06-15 11:45:31',NULL,_binary '\0'),(8,'SP113','SP MỚI',2,10,2,NULL,'AUTOMATIC',NULL,NULL,NULL,NULL,NULL,NULL,0,'2026-06-05 05:49:52','2026-06-15 11:49:38',NULL,_binary '\0'),(9,'Ádd','ROLOEX LEEE',1,5,1,'Sản phẩm thuộc dòng sịn sò ...vvv','AUTOMATIC',NULL,12.00,12.0,48,NULL,NULL,0,'2026-06-13 09:12:16','2026-06-15 11:49:44','roloex-leee',_binary '\0'),(10,'RLX_SD','TODLADX',1,11,1,'Sản Phẩm mới','MANUAL','MINERAL',12.00,30.0,48,NULL,NULL,1,'2026-06-15 10:48:54','2026-06-15 10:48:54','todladx',_binary '\0'),(11,'RLX-SUB-124060','Rolex Submariner Date',5,15,4,'Huyền thoại lặn biển của Rolex, chống nước 300m, vỏ Oystersteel.','AUTOMATIC','SAPPHIRE',12.50,30.0,70,NULL,'Unidirectional rotating bezel, Date display, Oyster bracelet',1,'2026-06-15 13:13:20','2026-06-21 16:56:38','rolex-submariner-date',_binary ''),(12,'OMG-SM-210.30.42','Omega Seamaster Diver 300M',6,15,4,'Đồng hồ lặn biểu tượng của Omega, bộ máy Co-Axial METAS certified.','AUTOMATIC','SAPPHIRE',13.80,30.0,60,NULL,'Co-Axial Master Chronometer, Ceramic bezel, Wave dial',1,'2026-06-15 13:13:20','2026-06-21 16:56:45','omega-seamaster-diver-300m',_binary ''),(13,'SKO-SPB143','Seiko Prospex 1965 Diver',7,15,6,'Phiên bản kỷ niệm 1965 của Seiko Prospex, thiết kế cổ điển đầy tinh tế.','AUTOMATIC','SAPPHIRE',13.20,20.0,41,NULL,'Rotating inner bezel, LumiBrite, 200m water resistance',1,'2026-06-15 13:13:20','2026-06-19 16:36:50','seiko-prospex-1965-diver',_binary '\0'),(14,'CSO-GWG-2000-1A3','Casio G-Shock Mudmaster',8,14,6,'G-Shock tối thượng dành cho môi trường khắc nghiệt, chống bùn đất tuyệt đối.','SOLAR','MINERAL',17.10,20.0,NULL,NULL,'Solar powered, Mud resistant, Compass, Thermometer, GPS sync',1,'2026-06-15 13:13:20','2026-06-19 16:39:10','casio-g-shock-mudmaster',_binary '\0'),(15,'TAG-CAR-CBN2A1A','TAG Heuer Carrera Chronograph',9,1,5,'Biểu tượng của tốc độ và đua xe, Carrera Chronograph với bộ máy Calibre Heuer 02.','AUTOMATIC','SAPPHIRE',14.40,10.0,80,NULL,'Chronograph, Tachymeter scale, COSC Chronometer certified',1,'2026-06-15 13:13:20','2026-06-19 16:40:38','tag-heuer-carrera-chronograph',_binary '\0'),(16,'TIS-PRX-T137.407','Tissot PRX Powermatic 80',10,1,6,'Thiết kế sang trọng tối giản theo phong cách thập niên 70, mỏng và đẳng cấp.','AUTOMATIC','SAPPHIRE',9.90,10.0,80,NULL,'Powermatic 80 movement, Integrated bracelet, Sapphire crystal',1,'2026-06-15 13:13:20','2026-06-19 16:43:24','tissot-prx-powermatic-80',_binary '\0'),(17,'LNG-MAS-L2.793','Longines Master Collection Moonphase',11,1,5,'Tinh hoa đồng hồ Thụy Sĩ với chức năng lịch vạn niên và hiển thị tuần trăng.','AUTOMATIC','SAPPHIRE',10.70,5.0,64,NULL,'Moon phase, Annual calendar, COSC Chronometer',1,'2026-06-15 13:13:20','2026-06-19 16:47:45','longines-master-collection-moonphase',_binary '\0'),(18,'IWC-PIL-IW377709','IWC Pilot\'s Watch Mark XVIII',12,16,5,'Kế thừa truyền thống đồng hồ phi công từ 1948, lõi thép mềm chống từ trường.','AUTOMATIC','SAPPHIRE',10.80,6.0,68,NULL,'Soft iron inner case, Anti-magnetic, Pilot crown, Date',1,'2026-06-15 13:13:20','2026-06-19 16:49:33','iwc-pilot-s-watch-mark-xviii',_binary '\0'),(19,'OMG-SPD-324.30.38','Omega Speedmaster 38',6,2,4,'Speedmaster phiên bản 38mm thanh lịch dành cho phái nữ yêu tốc độ.','AUTOMATIC','SAPPHIRE_COATED',12.20,10.0,60,NULL,'Chronograph, Tachymeter bezel, Co-Axial Calibre 3330',1,'2026-06-15 13:13:20','2026-06-19 16:51:58','omega-speedmaster-38',_binary '\0'),(20,'SKO-SARB065','Seiko Cocktail Time',7,1,6,'Đồng hồ dress watch trang nhã của Seiko với mặt số texture lấy cảm hứng từ cocktail.','AUTOMATIC','HARDLEX',11.00,3.0,50,NULL,'Dress watch, Textured dial, Power reserve indicator',1,'2026-06-15 13:13:20','2026-06-19 16:50:44','seiko-cocktail-time',_binary '\0'),(21,'AĐMIND','Casio 7I89',2,13,2,'Sản phẩm chất lượng cao lắm luon á','MANUAL','SAPPHIRE',12.50,30.0,48,NULL,'Hiện Đại',1,'2026-06-22 15:26:35','2026-06-22 15:26:35','casio-7i89',_binary '\0'),(22,'SKO-PRESAGE-001','Seiko Presage Cocktail Time',7,1,6,'Đồng hồ cơ automatic phong cách cocktail','AUTOMATIC',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:25:47','2026-06-25 04:34:05','seiko-presage-cocktail-time',_binary '\0'),(23,'RLX-SUB-002','Rolex Submariner Date Women',5,1,3,'Đồng hồ lặn cơ automatic huyền thoại, chống nước 300m','AUTOMATIC',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:36:12','2026-08-06 16:44:15','rolex-submariner-date-women',_binary ''),(24,'RLX-DJ36-001','Rolex Datejust 36',5,1,3,'Đồng hồ lịch ngày cổ điển, mặt số trắng pha lê','AUTOMATIC',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:36:32','2026-06-25 05:13:26','rolex-datejust-36',_binary '\0'),(25,'RLX-DD40-001','Rolex Day-Date 40',5,1,3,'Đồng hồ vàng 18k, hiển thị thứ và ngày, biểu tượng quyền lực','AUTOMATIC',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:36:46','2026-08-08 09:52:07','rolex-day-date-40',_binary '\0'),(26,'OMG-SM300-001','Omega Seamaster 300',6,1,3,'Đồng hồ lặn co-axial master chronometer, chống nước 300m','AUTOMATIC',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:36:59','2026-06-25 10:27:42','omega-seamaster-300',_binary '\0'),(27,'OMG-SPM-001','Omega Speedmaster Moonwatch',6,1,3,'Chronograph lên dây tay, đồng hồ từng lên Mặt Trăng năm 1969','MANUAL',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:37:17','2026-06-25 05:17:01','omega-speedmaster-moonwatch',_binary '\0'),(28,'OMG-CONST-001','Omega Constellation',6,2,3,'Đồng hồ nữ thanh lịch, nạm kim cương, dây tích hợp ôm cổ tay','QUARTZ',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:37:30','2026-06-25 05:16:42','omega-constellation',_binary '\0'),(29,'CAS-GA100-001','Casio G-Shock GA-100',8,1,1,'Đồng hồ thể thao chống va đập, chịu nước 200m','QUARTZ',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:37:42','2026-06-25 05:15:47','casio-g-shock-ga-100',_binary '\0'),(30,'CAS-EFR550-001','Casio Edifice EFR-550',8,1,2,'Chronograph thể thao, chống nước 100m, kính sapphire','QUARTZ',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:37:58','2026-06-25 05:15:19','casio-edifice-efr-550',_binary '\0'),(31,'APL-WS9-45-001','Apple Watch Series 9 45mm',4,4,2,'Đồng hồ thông minh chip S9, màn hình Always-On Retina','SMART',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:38:09','2026-06-25 05:14:07','apple-watch-series-9-45mm',_binary '\0'),(32,'APL-WU2-001','Apple Watch Ultra 2',4,4,3,'Đồng hồ thể thao đỉnh cao, GPS chính xác, pin 60h, titan','SMART',NULL,NULL,NULL,NULL,NULL,NULL,1,'2026-06-25 04:38:29','2026-08-08 09:51:15','apple-watch-ultra-2',_binary '\0'),(34,'ádád','ROLEX',13,6,2,'Sản phẩm ấn tượng','MANUAL','MINERAL',12.50,30.0,48,NULL,'Tính năng chuyên dung',1,'2026-08-08 04:37:01','2026-08-08 09:01:33','rolex',_binary '');
/*!40000 ALTER TABLE `watch` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `watch_image`
--

DROP TABLE IF EXISTS `watch_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `watch_image` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_primary` bit(1) NOT NULL DEFAULT b'0',
  `sort_order` int NOT NULL DEFAULT '0',
  `url` varchar(500) NOT NULL,
  `watch_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfoulfuqmvuh3yjpquebcp2b71` (`watch_id`),
  CONSTRAINT `FKfoulfuqmvuh3yjpquebcp2b71` FOREIGN KEY (`watch_id`) REFERENCES `watch` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_image`
--

LOCK TABLES `watch_image` WRITE;
/*!40000 ALTER TABLE `watch_image` DISABLE KEYS */;
/*!40000 ALTER TABLE `watch_image` ENABLE KEYS */;
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
  `dial_color` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Màu mặt số',
  `strap_color_id` int DEFAULT NULL COMMENT 'Màu dây',
  `strap_color` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Màu dây',
  `strap_material` enum('CERAMIC','GOLD','LEATHER','MESH','NYLON','RUBBER','STAINLESS_STEEL','TITANIUM') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `case_size_mm` decimal(5,2) DEFAULT NULL COMMENT 'Kích thước mặt (mm)',
  `price` decimal(15,0) NOT NULL,
  `image_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện biến thể',
  `stock_quantity` int NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `cost_price` decimal(15,0) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `idx_watch_variant` (`watch_id`),
  KEY `idx_wv_dial_color` (`dial_color_id`),
  KEY `idx_wv_strap_color` (`strap_color_id`),
  CONSTRAINT `fk_wv_dial_color` FOREIGN KEY (`dial_color_id`) REFERENCES `color` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wv_strap_color` FOREIGN KEY (`strap_color_id`) REFERENCES `color` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_wv_watch` FOREIGN KEY (`watch_id`) REFERENCES `watch` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_variant`
--

LOCK TABLES `watch_variant` WRITE;
/*!40000 ALTER TABLE `watch_variant` DISABLE KEYS */;
INSERT INTO `watch_variant` VALUES (3,2,1,NULL,1,NULL,NULL,45.00,3500000,'https://example.com/gshock-black.jpg',20,1,2450000),(4,3,NULL,NULL,5,NULL,NULL,42.00,180000000,'https://example.com/omega-blue.jpg',3,1,126000000),(5,4,1,NULL,1,NULL,NULL,45.00,12990000,'https://example.com/applewatch-black.jpg',15,1,9093000),(8,7,NULL,'yellow',NULL,'black',NULL,12.00,10000000,'',1,1,7000000),(9,8,NULL,'black',NULL,'black',NULL,123.00,123123000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1780638601/tawatch/watches/luuyhhstwb8lyg1pi166.png',1,1,86186100),(10,8,NULL,'XXX',NULL,'XXXX',NULL,12.00,1000000,'',10,1,700000),(11,9,NULL,'Bạc',NULL,'Đen',NULL,12.00,200000000,'',4,1,140000000),(12,10,NULL,NULL,NULL,NULL,'RUBBER',12.00,1000000,'',10,1,700000),(13,2,NULL,NULL,NULL,NULL,'TITANIUM',12.00,100000000,'',10,1,70000000),(14,11,9,NULL,9,NULL,'STAINLESS_STEEL',41.00,280000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781842537/tawatch/watches/uspmbhuq42asyq1dzngb.webp',2,1,196000000),(15,12,11,NULL,9,NULL,'RUBBER',42.00,150000000,'',2,1,105000000),(16,13,11,NULL,9,NULL,'LEATHER',40.50,25000000,'',15,1,17500000),(17,14,9,NULL,9,NULL,'RUBBER',55.00,18000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887101/tawatch/watches/oz1ujfr0krvgcjwovge8.webp',20,1,12600000),(18,15,9,NULL,9,NULL,'LEATHER',44.00,90000000,'',5,1,63000000),(19,16,11,NULL,10,NULL,'STAINLESS_STEEL',40.00,16000000,'',28,1,11200000),(20,17,10,NULL,15,NULL,'LEATHER',40.00,65000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887497/tawatch/watches/w3tcaqzfcnufll4exq3f.webp',6,1,45500000),(21,18,9,NULL,15,NULL,'LEATHER',40.00,110000000,'',12,1,77000000),(22,19,13,NULL,10,NULL,'STAINLESS_STEEL',38.00,145000000,'',10,1,101500000),(23,20,16,NULL,15,NULL,'LEATHER',38.00,8500000,'',29,1,5950000),(24,21,5,NULL,5,NULL,'STAINLESS_STEEL',12.00,5000000,'',7,1,3500000),(25,22,5,NULL,5,NULL,'STAINLESS_STEEL',40.50,5200000,'',8,1,3640000),(26,22,9,NULL,5,NULL,'STAINLESS_STEEL',40.50,5200000,'',3,1,3640000),(27,23,1,NULL,5,NULL,'STAINLESS_STEEL',41.00,320000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364360/tawatch/watches/jpb0bkzacqhufwtirdh8.jpg',8,1,224000000),(28,23,5,NULL,5,NULL,'STAINLESS_STEEL',41.00,325000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364362/tawatch/watches/w2euner8dknrbmbtpcaw.jpg',2,1,227500000),(29,24,2,NULL,6,NULL,'STAINLESS_STEEL',36.00,180000000,'',3,1,126000000),(30,25,6,NULL,6,NULL,'STAINLESS_STEEL',40.00,580000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364505/tawatch/watches/jaylcj2rcexzfbewashi.jpg',1,1,406000000),(31,26,1,NULL,1,NULL,'STAINLESS_STEEL',42.00,90000000,'',3,1,63000000),(32,26,NULL,NULL,1,NULL,'STAINLESS_STEEL',42.00,92000000,'',3,1,64400000),(33,27,1,NULL,1,NULL,'LEATHER',42.00,120000000,'',1,1,84000000),(34,28,2,NULL,6,NULL,'STAINLESS_STEEL',28.00,80000000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364586/tawatch/watches/jsex5smasxqn8jl8e0qy.jpg',2,1,56000000),(35,29,1,NULL,1,NULL,'RUBBER',48.00,1800000,'',16,1,1260000),(36,29,2,NULL,2,NULL,'RUBBER',48.00,1800000,'',15,1,1260000),(37,30,1,NULL,5,NULL,'STAINLESS_STEEL',45.00,4200000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364472/tawatch/watches/mbjp5zsy7n99adzg7gf7.jpg',6,1,2940000),(38,31,8,NULL,1,NULL,'RUBBER',45.00,9900000,'',10,1,6930000),(39,31,5,NULL,2,NULL,'RUBBER',45.00,9900000,'',12,1,6930000),(40,32,1,NULL,1,NULL,'GOLD',49.00,29990000,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg',2,1,20993000),(41,32,5,NULL,9,NULL,'STAINLESS_STEEL',12.00,1222200,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782375339/tawatch/watches/pix6qaxjthpxfrgjp420.jpg',0,1,855540),(43,34,5,NULL,5,NULL,'STAINLESS_STEEL',15.00,149977,'',20,1,104983);
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
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `alt_text` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Ảnh đại diện của biến thể này',
  `is_main_image` tinyint(1) NOT NULL DEFAULT '0' COMMENT 'Ảnh đại diện hiển thị chung cho toàn sản phẩm',
  `sort_order` int NOT NULL DEFAULT '0',
  `public_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_wvi_variant` (`variant_id`),
  KEY `idx_wvi_variant_id` (`variant_id`),
  KEY `idx_wvi_is_main_image` (`is_main_image`),
  CONSTRAINT `fk_wvi_variant` FOREIGN KEY (`variant_id`) REFERENCES `watch_variant` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `watch_variant_image`
--

LOCK TABLES `watch_variant_image` WRITE;
/*!40000 ALTER TABLE `watch_variant_image` DISABLE KEYS */;
INSERT INTO `watch_variant_image` VALUES (5,8,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1780637662/tawatch/watches/v2qborcaralvnh2ti1c8.jpg',NULL,1,0,0,'tawatch/watches/v2qborcaralvnh2ti1c8'),(6,9,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1780638601/tawatch/watches/luuyhhstwb8lyg1pi166.png',NULL,1,1,0,'tawatch/watches/luuyhhstwb8lyg1pi166'),(8,9,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1780641427/tawatch/watches/k0k0z7qifb6ynn8hty3a.png',NULL,0,0,1,'tawatch/watches/k0k0z7qifb6ynn8hty3a'),(9,10,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1780641583/tawatch/watches/djj6gbn4tgfsbacdax4y.png',NULL,1,0,0,'tawatch/watches/djj6gbn4tgfsbacdax4y'),(10,11,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781341946/tawatch/watches/louiseeoamu9ecwiftcg.webp',NULL,1,1,0,'tawatch/watches/louiseeoamu9ecwiftcg'),(11,11,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781341951/tawatch/watches/xpkwvzvpyk4mghefi9r8.webp',NULL,0,0,1,'tawatch/watches/xpkwvzvpyk4mghefi9r8'),(12,11,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781341955/tawatch/watches/shl86qqji3rckqgzr40l.webp',NULL,0,0,2,'tawatch/watches/shl86qqji3rckqgzr40l'),(13,12,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781520542/tawatch/watches/rzskkarpboqnqeqz6wop.webp',NULL,1,1,0,'tawatch/watches/rzskkarpboqnqeqz6wop'),(14,12,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781520546/tawatch/watches/wbwmuslgmypcbykw3phq.webp',NULL,0,0,1,'tawatch/watches/wbwmuslgmypcbykw3phq'),(15,13,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781521109/tawatch/watches/vkdewjl6xc1u0nmatfnw.png',NULL,1,1,0,'tawatch/watches/vkdewjl6xc1u0nmatfnw'),(16,13,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781521116/tawatch/watches/sekwstvb6joq0rtit9fk.png',NULL,0,0,1,'tawatch/watches/sekwstvb6joq0rtit9fk'),(17,14,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781842537/tawatch/watches/uspmbhuq42asyq1dzngb.webp',NULL,1,1,0,'tawatch/watches/uspmbhuq42asyq1dzngb'),(18,14,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781842542/tawatch/watches/p8gs1qqkqm3tlaurugq4.webp',NULL,0,0,1,'tawatch/watches/p8gs1qqkqm3tlaurugq4'),(19,15,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781886929/tawatch/watches/yxqiwetasxoah8vkyitk.webp',NULL,1,1,0,'tawatch/watches/yxqiwetasxoah8vkyitk'),(20,16,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887021/tawatch/watches/jve8cc3b8ajbfy2zb4pj.webp',NULL,1,1,0,'tawatch/watches/jve8cc3b8ajbfy2zb4pj'),(21,17,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887101/tawatch/watches/oz1ujfr0krvgcjwovge8.webp',NULL,1,1,0,'tawatch/watches/oz1ujfr0krvgcjwovge8'),(22,18,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887250/tawatch/watches/vqpduvpk82wkcoy02gga.webp',NULL,1,1,0,'tawatch/watches/vqpduvpk82wkcoy02gga'),(23,19,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887416/tawatch/watches/z7fui4rfoas502ocgbby.webp',NULL,1,1,0,'tawatch/watches/z7fui4rfoas502ocgbby'),(24,20,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887497/tawatch/watches/w3tcaqzfcnufll4exq3f.webp',NULL,1,1,0,'tawatch/watches/w3tcaqzfcnufll4exq3f'),(25,20,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887606/tawatch/watches/al0ntjrnk2ixfcq1lxlt.webp',NULL,0,0,1,'tawatch/watches/al0ntjrnk2ixfcq1lxlt'),(26,21,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887784/tawatch/watches/hnmlcrpescf7tvdwnjra.webp',NULL,1,1,0,'tawatch/watches/hnmlcrpescf7tvdwnjra'),(27,23,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887855/tawatch/watches/ufx75jl1cmknv6njxzb4.webp',NULL,1,1,0,'tawatch/watches/ufx75jl1cmknv6njxzb4'),(28,22,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1781887929/tawatch/watches/lvzh9yg15nmtic7qmki3.webp',NULL,1,1,0,'tawatch/watches/lvzh9yg15nmtic7qmki3'),(29,24,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782142008/tawatch/watches/klf73ueob05itfjvfaud.webp',NULL,1,1,0,'tawatch/watches/klf73ueob05itfjvfaud'),(30,24,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782142013/tawatch/watches/d1bft5axjhvfkf46rkri.webp',NULL,0,0,1,'tawatch/watches/d1bft5axjhvfkf46rkri'),(31,25,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782362059/tawatch/watches/cnglfjpkmbr5ss1xmwc8.jpg',NULL,1,1,0,'tawatch/watches/cnglfjpkmbr5ss1xmwc8'),(32,26,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782362076/tawatch/watches/dknja1any6spd7vsw3sq.jpg',NULL,1,0,0,'tawatch/watches/dknja1any6spd7vsw3sq'),(33,40,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782363744/tawatch/watches/qq5nt2ll77gqth7h2iti.jpg',NULL,1,1,0,'tawatch/watches/qq5nt2ll77gqth7h2iti'),(34,27,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364360/tawatch/watches/jpb0bkzacqhufwtirdh8.jpg',NULL,1,1,0,'tawatch/watches/jpb0bkzacqhufwtirdh8'),(35,28,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364362/tawatch/watches/w2euner8dknrbmbtpcaw.jpg',NULL,1,0,0,'tawatch/watches/w2euner8dknrbmbtpcaw'),(36,29,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364408/tawatch/watches/wallcvz1ksiud0k8n60c.jpg',NULL,1,1,0,'tawatch/watches/wallcvz1ksiud0k8n60c'),(37,38,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364449/tawatch/watches/vnjg1uu1pm9ztsakx6ha.jpg',NULL,1,1,0,'tawatch/watches/vnjg1uu1pm9ztsakx6ha'),(38,39,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364451/tawatch/watches/wgmx0qtrclqmvj6pcqnb.jpg',NULL,1,0,0,'tawatch/watches/wgmx0qtrclqmvj6pcqnb'),(39,37,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364472/tawatch/watches/mbjp5zsy7n99adzg7gf7.jpg',NULL,1,1,0,'tawatch/watches/mbjp5zsy7n99adzg7gf7'),(40,30,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364505/tawatch/watches/jaylcj2rcexzfbewashi.jpg',NULL,1,1,0,'tawatch/watches/jaylcj2rcexzfbewashi'),(41,35,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364549/tawatch/watches/alfhl99ysrepk1dudder.jpg',NULL,1,1,0,'tawatch/watches/alfhl99ysrepk1dudder'),(42,36,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364552/tawatch/watches/vk4i0tj0cqei3t7wvkgz.jpg',NULL,1,0,0,'tawatch/watches/vk4i0tj0cqei3t7wvkgz'),(43,34,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364586/tawatch/watches/jsex5smasxqn8jl8e0qy.jpg',NULL,1,1,0,'tawatch/watches/jsex5smasxqn8jl8e0qy'),(44,33,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782364623/tawatch/watches/ae37evfphjjewjf59sct.jpg',NULL,1,1,0,'tawatch/watches/ae37evfphjjewjf59sct'),(45,41,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782375339/tawatch/watches/pix6qaxjthpxfrgjp420.jpg',NULL,1,0,0,'tawatch/watches/pix6qaxjthpxfrgjp420'),(46,31,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782383265/tawatch/watches/q1eimhzmdmc1hthsbemr.jpg',NULL,1,1,0,'tawatch/watches/q1eimhzmdmc1hthsbemr'),(47,32,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1782383267/tawatch/watches/fumjjubxolmltfpsygir.webp',NULL,1,0,0,'tawatch/watches/fumjjubxolmltfpsygir'),(48,43,'https://res.cloudinary.com/dpyqxtbv6/image/upload/v1786163823/tawatch/watches/n7m3gjpx7ixuuvu2gics.jpg',NULL,1,1,0,'tawatch/watches/n7m3gjpx7ixuuvu2gics');
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist`
--

LOCK TABLES `wishlist` WRITE;
/*!40000 ALTER TABLE `wishlist` DISABLE KEYS */;
INSERT INTO `wishlist` VALUES (2,22,17,'2026-06-23 12:47:34'),(10,22,14,'2026-06-23 13:23:25'),(13,4,34,'2026-07-01 07:29:14'),(16,23,41,'2026-08-06 18:07:23'),(17,22,35,'2026-08-10 13:15:58');
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

-- Dump completed on 2026-08-12 19:00:06
