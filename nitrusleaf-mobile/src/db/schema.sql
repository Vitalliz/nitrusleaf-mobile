CREATE DATABASE  IF NOT EXISTS `nitrusleaf_pi` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `nitrusleaf_pi`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: nitrusleaf_pi
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `alqueires`
--

DROP TABLE IF EXISTS `alqueires`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alqueires` (
  `id_alqueire` int(11) NOT NULL AUTO_INCREMENT,
  `id_propriedade` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `area_total` decimal(10,2) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `coordenadas_poligono` text DEFAULT NULL COMMENT 'JSON array de coordenadas para desenhar o polígono do alqueire',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_alqueire`),
  KEY `id_propriedade` (`id_propriedade`),
  CONSTRAINT `alqueires_ibfk_1` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_10` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_11` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_12` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_13` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_14` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_15` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_16` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_17` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_18` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_19` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_2` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_20` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_21` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_22` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_23` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_24` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_25` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_26` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_27` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_28` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_29` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_3` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_30` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_31` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_32` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_33` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_34` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_35` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_36` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_37` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_38` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_39` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_4` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_40` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_41` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_42` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_43` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_44` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_45` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_46` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_47` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_48` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_49` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_5` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_50` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_51` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_52` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_53` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_54` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_55` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_56` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_57` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_58` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_59` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_6` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_60` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_61` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_62` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_63` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_64` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_65` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_66` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_67` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_68` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_69` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_7` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_70` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_71` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_72` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_73` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_74` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_75` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_76` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_77` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_78` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_79` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_8` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_80` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_81` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_82` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_83` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_84` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_85` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_86` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_87` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `alqueires_ibfk_9` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `deficiencia`
--

DROP TABLE IF EXISTS `deficiencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deficiencia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `p` varchar(255) NOT NULL,
  `s` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `foto`
--

DROP TABLE IF EXISTS `foto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `foto` (
  `id_foto` int(11) NOT NULL AUTO_INCREMENT,
  `id_pe` int(11) DEFAULT NULL,
  `id_talhao` int(11) DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `data_tiragem` datetime DEFAULT NULL,
  `resultado_analise` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_foto`),
  KEY `id_pe` (`id_pe`),
  KEY `id_talhao` (`id_talhao`),
  CONSTRAINT `foto_ibfk_1` FOREIGN KEY (`id_pe`) REFERENCES `pes` (`id_pe`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `foto_ibfk_2` FOREIGN KEY (`id_talhao`) REFERENCES `talhoes` (`id_talhao`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `histal`
--

DROP TABLE IF EXISTS `histal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `histal` (
  `id_pe` int(11) NOT NULL AUTO_INCREMENT,
  `id_talhao` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `situacao` enum('Tratado','Não tratado','Sem informações') NOT NULL,
  `data_criacao` date NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_pe`),
  KEY `id_talhao` (`id_talhao`),
  CONSTRAINT `histal_ibfk_1` FOREIGN KEY (`id_talhao`) REFERENCES `talhoes` (`id_talhao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `historico`
--

DROP TABLE IF EXISTS `historico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico` (
  `id_historico` int(11) NOT NULL AUTO_INCREMENT,
  `id_talhao` varchar(255) NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_historico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `home`
--

DROP TABLE IF EXISTS `home`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `home` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pes`
--

DROP TABLE IF EXISTS `pes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pes` (
  `id_pe` int(11) NOT NULL AUTO_INCREMENT,
  `id_talhao` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `situacao` enum('Tratado','Não-Tratado','Sem-informações') DEFAULT 'Sem-informações',
  `deficiencia_cobre` tinyint(1) DEFAULT 0,
  `deficiencia_manganes` tinyint(1) DEFAULT 0,
  `outros` tinyint(1) DEFAULT 0,
  `observacoes` varchar(255) DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_pe`),
  KEY `id_talhao` (`id_talhao`),
  CONSTRAINT `pes_ibfk_1` FOREIGN KEY (`id_talhao`) REFERENCES `talhoes` (`id_talhao`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `propriedades`
--

DROP TABLE IF EXISTS `propriedades`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `propriedades` (
  `id_propriedade` int(11) NOT NULL AUTO_INCREMENT,
  `id_usuario` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `cep` varchar(255) NOT NULL,
  `logradouro` varchar(255) NOT NULL,
  `numero` int(11) NOT NULL,
  `bairro` varchar(255) NOT NULL,
  `cidade` varchar(255) NOT NULL,
  `talhoes_registrados` int(11) DEFAULT 0,
  `total_pes` int(11) DEFAULT 0,
  `pes_analisados` int(11) DEFAULT 0,
  `pes_diagnosticados` int(11) DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `regiao` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_propriedade`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `propriedades_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `relatorios`
--

DROP TABLE IF EXISTS `relatorios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `relatorios` (
  `id_relatorio` int(11) NOT NULL AUTO_INCREMENT,
  `id_pe` int(11) DEFAULT NULL,
  `id_foto` int(11) DEFAULT NULL,
  `deficiencia_cobre` tinyint(1) DEFAULT 0,
  `deficiencia_manganes` tinyint(1) DEFAULT 0,
  `outros` tinyint(1) DEFAULT 0,
  `observacoes` varchar(255) DEFAULT NULL,
  `data_analise` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_relatorio`),
  KEY `id_pe` (`id_pe`),
  KEY `id_foto` (`id_foto`),
  CONSTRAINT `relatorios_ibfk_1` FOREIGN KEY (`id_pe`) REFERENCES `pes` (`id_pe`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `relatorios_ibfk_2` FOREIGN KEY (`id_foto`) REFERENCES `foto` (`id_foto`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `talhoes`
--

DROP TABLE IF EXISTS `talhoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `talhoes` (
  `id_talhao` int(11) NOT NULL AUTO_INCREMENT,
  `id_propriedade` int(11) DEFAULT NULL,
  `id_alqueire` int(11) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `especie_fruta` varchar(255) NOT NULL,
  `total_pes` int(11) DEFAULT 0,
  `pes_analisados` int(11) DEFAULT 0,
  `pes_diagnosticados` int(11) DEFAULT 0,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `coordenadas_poligono` text DEFAULT NULL COMMENT 'JSON array de coordenadas para desenhar o polígono do talhão',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_talhao`),
  KEY `id_propriedade` (`id_propriedade`),
  KEY `id_alqueire` (`id_alqueire`),
  CONSTRAINT `talhoes_ibfk_1` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_10` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_100` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_101` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_102` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_103` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_104` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_105` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_106` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_107` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_108` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_109` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_11` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_110` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_111` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_112` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_113` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_114` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_115` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_116` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_117` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_118` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_119` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_12` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_120` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_121` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_122` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_123` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_124` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_125` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_126` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_127` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_128` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_129` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_13` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_130` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_131` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_132` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_133` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_134` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_135` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_136` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_137` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_138` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_139` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_14` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_140` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_141` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_142` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_143` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_144` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_145` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_146` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_147` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_148` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_149` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_15` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_150` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_151` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_152` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_153` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_154` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_155` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_156` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_157` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_158` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_159` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_16` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_160` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_161` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_162` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_163` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_164` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_165` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_166` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_167` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_168` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_169` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_17` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_170` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_171` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_172` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_18` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_19` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_2` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_20` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_21` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_22` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_23` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_24` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_25` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_26` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_27` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_28` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_29` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_3` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_30` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_31` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_32` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_33` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_34` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_35` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_36` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_37` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_38` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_39` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_4` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_40` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_41` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_42` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_43` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_44` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_45` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_46` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_47` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_48` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_49` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_5` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_50` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_51` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_52` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_53` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_54` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_55` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_56` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_57` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_58` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_59` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_6` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_60` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_61` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_62` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_63` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_64` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_65` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_66` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_67` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_68` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_69` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_7` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_70` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_71` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_72` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_73` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_74` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_75` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_76` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_77` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_78` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_79` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_8` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_80` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_81` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_82` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_83` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_84` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_85` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_86` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_87` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_88` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_89` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_9` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_90` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_91` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_92` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_93` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_94` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_95` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_96` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_97` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_98` FOREIGN KEY (`id_alqueire`) REFERENCES `alqueires` (`id_alqueire`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `talhoes_ibfk_99` FOREIGN KEY (`id_propriedade`) REFERENCES `propriedades` (`id_propriedade`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `nome` varchar(255) NOT NULL,
  `sobrenome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `login` varchar(255) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `celular` varchar(255) DEFAULT NULL,
  `tipo_pessoa` enum('fisica','juridica') NOT NULL DEFAULT 'fisica',
  `cpf` varchar(255) DEFAULT NULL,
  `cep` varchar(255) DEFAULT NULL,
  `cnpj` varchar(255) DEFAULT NULL,
  `nome_fantasia` varchar(255) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `numero` varchar(255) DEFAULT NULL,
  `bairro` varchar(255) DEFAULT NULL,
  `cidade` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-07 17:09:06
