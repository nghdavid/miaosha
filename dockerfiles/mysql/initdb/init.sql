-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： miaosha.ccmr849byj70.ap-northeast-1.rds.amazonaws.com:3306
-- 產生時間： 2022 年 11 月 29 日 06:36
-- 伺服器版本： 8.0.28
-- PHP 版本： 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `miaosha`
--

-- --------------------------------------------------------

--
-- 資料表結構 `miaosha_orders`
--

CREATE TABLE `miaosha_orders` (
  `id` smallint UNSIGNED NOT NULL,
  `user_id` mediumint UNSIGNED NOT NULL,
  `miaosha_id` mediumint UNSIGNED NOT NULL,
  `price` smallint UNSIGNED NOT NULL,
  `amount` smallint UNSIGNED DEFAULT '1',
  `name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` char(10) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `order_num` char(16) DEFAULT NULL,
  `status` tinyint UNSIGNED DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `miaosha_orders`
--

INSERT INTO `miaosha_orders` (`id`, `user_id`, `miaosha_id`, `price`, `amount`, `name`, `email`, `phone`, `address`, `order_num`, `status`, `created_at`) VALUES
(1, 19, 1, 100, 1, 'baganono', 'baganono@gmail.com', '9809890849', '台北市中正區仁愛路二段99號', '2022112906668021', 1, '2022-11-29 06:35:38');

-- --------------------------------------------------------

--
-- 資料表結構 `miaosha_product`
--

CREATE TABLE `miaosha_product` (
  `id` mediumint UNSIGNED NOT NULL,
  `product_id` mediumint UNSIGNED NOT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `price` smallint UNSIGNED NOT NULL,
  `stock` smallint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `miaosha_product`
--

INSERT INTO `miaosha_product` (`id`, `product_id`, `start_time`, `end_time`, `price`, `stock`) VALUES
(1, 1, '2022-11-16 15:29:53', '2022-11-18 15:35:31', 100, 100);

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `id` smallint UNSIGNED NOT NULL,
  `order_num` char(16) DEFAULT NULL,
  `user_id` mediumint UNSIGNED NOT NULL,
  `product_id` mediumint UNSIGNED NOT NULL,
  `price` smallint UNSIGNED NOT NULL,
  `amount` smallint UNSIGNED NOT NULL,
  `status` tinyint UNSIGNED DEFAULT '0',
  `name` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` char(10) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- 資料表結構 `product`
--

CREATE TABLE `product` (
  `id` mediumint UNSIGNED NOT NULL,
  `name` varchar(16) NOT NULL,
  `image` varchar(50) DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `price` smallint UNSIGNED NOT NULL,
  `stock` smallint UNSIGNED DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `product`
--

INSERT INTO `product` (`id`, `name`, `image`, `detail`, `price`, `stock`) VALUES
(1, 'PS5', NULL, 'ps5.jpg', 100, 1000);

-- --------------------------------------------------------

--
-- 資料表結構 `user`
--

CREATE TABLE `user` (
  `id` mediumint UNSIGNED NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` char(60) DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `role_id` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `name`, `role_id`) VALUES
(1, 'test1@test.com', '$2b$10$BGXreI2whpVry8UMqQuWPec.hg4T9blDmqZClkXkXDp2S9hcR.Q1W', 'david', 2),
(2, 'test2@test.com', '$2b$10$IqdL0zHLKS5bSP2KiEL1sOuePZk2zjY65aAf2QigPdO.DCq0JIAVy', 'david', 2),
(3, 'test3@test.com', '$2b$10$mWV6u9hmfwQueHeuUXDl4OzHOI.2PYyjUS5rwRQhcoGJlog1.Beli', 'david', 2),
(4, 'test4@test.com', '$2b$10$SZmB2fWRGjvozIpIT9a3ie/a80TTgSrTBKe2sPGlQQ6JyGiwefvFO', 'david', 2),
(5, 'test5@test.com', '$2b$10$qBMEAKSAX0V14mfd9dNxc.85J6TCF8D.Zf3MTWkFK47m8YUb1W3L6', 'david', 2),
(6, 'test6@test.com', '$2b$10$8OCYnp6dQyuwvutYAcOyrevkTOxy/kz.YkfTV8KjOLRPXbWk6EeQW', 'david', 2),
(7, 'test7@test.com', '$2b$10$Kl1ghqXpQ0Fb79rIiA9pKuhHaqu/J97tMsTnJzPUh4dnXufSGZXCS', 'david', 2),
(8, 'test8@test.com', '$2b$10$metQ6uaUkf/G4k6Ar11rauZ/iTGMRmT21C.Gjlu7Z4GhPA.DICG7u', 'david', 2),
(9, 'test9@test.com', '$2b$10$NpDbLs.sngQ2O8ELudbP/OXYR5Hi15m00KZ5L3YXlQJahl6Sjh8X2', 'david', 2),
(10, 'test10@test.com', '$2b$10$CyfjccBQeb7uWDQF1uurAuFKDTYW221CDkFfaaF33U0q0WdvJutUm', 'david', 2),
(11, 'test11@test.com', '$2b$10$l7Lf42BqQTDIgey2tNeiuOIUHWtBm.7fy0cFLJOhR9qQcqOYCaRYq', 'david', 2),
(12, 'test12@test.com', '$2b$10$zzFVgTjKM.pCKvUNoxNPe.mIkmza7EHMgxC6W0/H5vNfvzYNbfOJi', 'david', 2),
(13, 'test13@test.com', '$2b$10$iSkikLmLaNanLzOxR5YlI.6JQJglEWO/BeTYWsjM3TMfxpyym7Z/y', 'david', 2),
(14, 'test14@test.com', '$2b$10$QhMoUOe/47tWXY/UkX1aeOJAgvewgTVMvDnfEsrPfFsqz3Jbe7kfO', 'david', 2),
(15, 'test15@test.com', '$2b$10$iEIfclijOjCvY9UixTW4/.pwyCZvavPfUMosqNhy74lJGMEhQXVke', 'david', 2),
(16, 'test16@test.com', '$2b$10$nqDdqynLJG/hH.NJVwQQw.zR6zONcivYfQ0PCiDSek3wwwliejNuq', 'david', 2),
(18, 'test17@test.com', '$2b$10$feI86UNYYNlIWHbsihheeec1/NGe.XkeEo80.3uI1J.I.n4ZEAmfW', 'david', 2),
(19, 'baganono@gmail.com', '$2b$10$UBFUgYXROGqBLA2IBJzCkualdZiPEw1qpo7QBcJUNlBBCyUrCme6u', 'baganono', 2);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `miaosha_orders`
--
ALTER TABLE `miaosha_orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `miaosha_id` (`miaosha_id`);

--
-- 資料表索引 `miaosha_product`
--
ALTER TABLE `miaosha_product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `product_id` (`product_id`);

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `product_id` (`product_id`);

--
-- 資料表索引 `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- 資料表索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `miaosha_orders`
--
ALTER TABLE `miaosha_orders`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `miaosha_product`
--
ALTER TABLE `miaosha_product`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `product`
--
ALTER TABLE `product`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user`
--
ALTER TABLE `user`
  MODIFY `id` mediumint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- 已傾印資料表的限制式
--

--
-- 資料表的限制式 `miaosha_orders`
--
ALTER TABLE `miaosha_orders`
  ADD CONSTRAINT `miaosha_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `miaosha_orders_ibfk_2` FOREIGN KEY (`miaosha_id`) REFERENCES `miaosha_product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `miaosha_product`
--
ALTER TABLE `miaosha_product`
  ADD CONSTRAINT `miaosha_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- 資料表的限制式 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
