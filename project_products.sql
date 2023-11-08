CREATE DATABASE  IF NOT EXISTS `project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `project`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: project
-- ------------------------------------------------------
-- Server version	8.0.34

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
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `productCode` varchar(15) NOT NULL,
  `productName` varchar(70) NOT NULL,
  `productLine` varchar(50) NOT NULL,
  `productBrand` varchar(30) DEFAULT NULL,
  `productDescription` text NOT NULL,
  `quantityInStock` smallint DEFAULT NULL,
  `buyPrice` decimal(10,2) DEFAULT NULL,
  `imageLink` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`productCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('AIO1','MasterLiquid ML360','AIO Cooler','Cooler Master','masterliquidml360aiocoolercoolermaster',200,119.99,'image/ML360.png'),('CPU1','i9 13900K','CPU','Intel','i913900kcpuintel',220,599.99,'image/i9-13900k.jpg'),('CPU2','Ryzen 9 7950x3D','CPU','AMD','ryzen97950x3dcpuamd',328,329.99,'image/7950x3d.jpg'),('CPU3','Ryzen 7 7700x','CPU','AMD','ryzen77700xcpuamd',234,269.99,'image/7700X.jpg'),('GPU1','RTX4090 ROG STRIX x Evangelion','Graphic Card','ASUS ROG','rtx4090rogstrixxevangeliongraphiccardasusroggpu',400,2499.99,'image/4090.png'),('GPU2','Red Dragon Radeon RX 6800XT','Graphic Card','PowerColor','reddragonradeonrx6800xtgraphiccardpowercolor',232,549.99,'image/RX6800XT.jpg'),('GPU3','ARC A750','Graphic Card','Intel','arca750graphiccardintelgpu',23,289.99,'image/A750.jpg'),('GPU4','RTX4080 ProArt ','Graphic Card','ASUS','rtx4080proartgraphiccardasusgpu',134,1449.99,'image/4080proArt.jpg'),('RAM1','G.Skill Trident Z Royal 16GBx2','RAM','G.Skill','gskilltridentzroyal16gbx2ramgskill',123,162.99,'image/TridentZRoyal.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-08 22:35:37
