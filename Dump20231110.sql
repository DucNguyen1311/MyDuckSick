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
-- Table structure for table `aiodetail`
--

DROP TABLE IF EXISTS `aiodetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aiodetail` (
  `productCode` varchar(50) NOT NULL,
  `CPUsocket` text NOT NULL,
  `LED` varchar(45) NOT NULL,
  `airFlow` varchar(45) NOT NULL,
  PRIMARY KEY (`productCode`),
  CONSTRAINT `aiodetail_ibfk_1` FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aiodetail`
--

LOCK TABLES `aiodetail` WRITE;
/*!40000 ALTER TABLE `aiodetail` DISABLE KEYS */;
INSERT INTO `aiodetail` VALUES ('AIO1','LGA2066, LGA2011-v3, LGA2011, LGA1700, LGA1200, LGA1151,LGA1150,LGA1155,LGA1156,AM4,AM3+,AM3,AM2+,AM2,FM2+,FM2,FM1','ARGB','650-1800 RPM');
/*!40000 ALTER TABLE `aiodetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `userID` int DEFAULT NULL,
  `productCode` varchar(15) DEFAULT NULL,
  `productQuantity` int DEFAULT NULL,
  KEY `FK_003` (`userID`),
  KEY `FK_004` (`productCode`),
  CONSTRAINT `FK_003` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`),
  CONSTRAINT `FK_004` FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (12,'CPU1',4),(12,'GPU4',2),(12,'GPU3',2),(12,'CPU2',5),(12,'CPU3',1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cpudetail`
--

DROP TABLE IF EXISTS `cpudetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cpudetail` (
  `productCode` varchar(15) NOT NULL,
  `CPUsocket` varchar(15) NOT NULL,
  `cores` int NOT NULL,
  `threads` int NOT NULL,
  `baseClock` varchar(15) NOT NULL,
  `maxClock` varchar(15) NOT NULL,
  `intergratedGPU` tinyint(1) NOT NULL,
  `CPUcache` varchar(15) NOT NULL,
  `TDP` varchar(15) NOT NULL,
  PRIMARY KEY (`productCode`),
  CONSTRAINT `FK_002` FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cpudetail`
--

LOCK TABLES `cpudetail` WRITE;
/*!40000 ALTER TABLE `cpudetail` DISABLE KEYS */;
INSERT INTO `cpudetail` VALUES ('CPU1','FCLGA1700',24,32,'P3.0/E2.2 GHz','P5.8/E2.2 GHz',1,'36MB','125W'),('CPU2','AM5',16,32,'4.2 GHz','5.7 GHz',1,'145MB','120W'),('CPU3','AM5',8,16,'4.5 GHz','5.4 GHz',0,'40MB','105W');
/*!40000 ALTER TABLE `cpudetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gpudetail`
--

DROP TABLE IF EXISTS `gpudetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gpudetail` (
  `productCode` varchar(45) NOT NULL,
  `memory` varchar(45) NOT NULL,
  `clock` varchar(45) NOT NULL,
  `cudaCores` varchar(45) NOT NULL,
  `headSink` tinyint NOT NULL,
  `memoryClock` varchar(45) NOT NULL,
  `TDP` varchar(45) NOT NULL,
  `RecommendedPSU` varchar(45) NOT NULL,
  PRIMARY KEY (`productCode`),
  CONSTRAINT `gpudetail_ibfk_1` FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gpudetail`
--

LOCK TABLES `gpudetail` WRITE;
/*!40000 ALTER TABLE `gpudetail` DISABLE KEYS */;
INSERT INTO `gpudetail` VALUES ('GPU1','24 GB GDDR6X','2610 MHz','16384',1,'21 Gpbs','450W','1000W'),('GPU2','16 GB GDDR6','2250 MHz','4608',1,'16 Gpbs','300W','800W'),('GPU3','8 GB GDDR6','2400 MHz','3584',1,'8 Gpbs','225W','550W'),('GPU4','16 GB GDDR6X','2600 MHz','9728',1,'22.4 Gpbs','320W','750W');
/*!40000 ALTER TABLE `gpudetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productlines`
--

DROP TABLE IF EXISTS `productlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productlines` (
  `productLine` varchar(50) NOT NULL,
  `textDescription` text,
  PRIMARY KEY (`productLine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productlines`
--

LOCK TABLES `productlines` WRITE;
/*!40000 ALTER TABLE `productlines` DISABLE KEYS */;
INSERT INTO `productlines` VALUES ('AIO Cooler','AiO stands for All in One, which means that you\'ll get a complete package, consisting of radiator, fan, pump, tubes and cooling unit, which reliably cools your CPU'),('CPU','The Central Processing Unit (CPU) is the primary component of a computer that acts as its control center.'),('Graphic Card/GPU','A graphics card is an expansion card for your PC that is responsible for rendering images to the display'),('RAM','RAM is your computer or laptops short-term memory. Its where the data is stored that your computer processor needs to run your applications and open your files.');
/*!40000 ALTER TABLE `productlines` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`productCode`),
  KEY `FK_001` (`productLine`),
  CONSTRAINT `FK_001` FOREIGN KEY (`productLine`) REFERENCES `productlines` (`productLine`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('AIO1','MasterLiquid ML360','AIO Cooler','Cooler Master','masterliquidml360aiocoolercoolermaster',200,119.99,'image/ML360.png'),('CPU1','i9 13900K','CPU','Intel','i913900kcpuintel',220,599.99,'image/i9-13900k.jpg'),('CPU2','Ryzen 9 7950x3D','CPU','AMD','ryzen97950x3dcpuamd',328,329.99,'image/7950x3d.jpg'),('CPU3','Ryzen 7 7700x','CPU','AMD','ryzen77700xcpuamd',234,269.99,'image/7700X.jpg'),('GPU1','RTX4090 ROG STRIX x Evangelion','Graphic Card/GPU','ASUS ROG/Nvidia','rtx4090rogstrixxevangeliongraphiccardasusroggpunvidia',400,2499.99,'image/4090.png'),('GPU2','Red Dragon Radeon RX 6800XT','Graphic Card/GPU','PowerColor/Nvidia','reddragonradeonrx6800xtgraphiccardpowercolornvidia',232,549.99,'image/RX6800XT.jpg'),('GPU3','ARC A750','Graphic Card/GPU','Intel','arca750graphiccardintelgpunvidia',23,289.99,'image/A750.jpg'),('GPU4','RTX4080 ProArt ','Graphic Card/GPU','ASUS/Nvidia','rtx4080proartgraphiccardasusgpunvidia',134,1449.99,'image/4080proArt.jpg'),('RAM1','G.Skill Trident Z Royal 8GBx2','RAM','G.Skill','gskilltridentzroyal8gbx2ramgskillnvidia',123,162.99,'image/TridentZRoyal.jpg');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ramdetail`
--

DROP TABLE IF EXISTS `ramdetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ramdetail` (
  `productCode` varchar(50) NOT NULL,
  `ramSocket` varchar(45) NOT NULL,
  `memory` varchar(45) NOT NULL,
  `BUS` varchar(45) NOT NULL,
  `voltage` varchar(45) NOT NULL,
  `ledRGB` tinyint NOT NULL,
  PRIMARY KEY (`productCode`),
  CONSTRAINT `ramdetail_ibfk_1` FOREIGN KEY (`productCode`) REFERENCES `products` (`productCode`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ramdetail`
--

LOCK TABLES `ramdetail` WRITE;
/*!40000 ALTER TABLE `ramdetail` DISABLE KEYS */;
INSERT INTO `ramdetail` VALUES ('RAM1','DDR4','16GB(8x2)','3600MHz','1.20v',0);
/*!40000 ALTER TABLE `ramdetail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `userEmail` varchar(30) NOT NULL,
  `userPassword` varchar(50) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `userAddress` varchar(100) NOT NULL,
  `userNumber` int DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'123@gmail.com','123','123','123',123),(12,'duyduc.miaham@gmail.com','123','Duc Nguyen','Pandora garden hanoi',973404879),(13,'test@gmail.com','123','123','123',123);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-10 14:02:19
