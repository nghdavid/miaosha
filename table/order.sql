CREATE TABLE orders (
  id smallint unsigned NOT NULL UNIQUE AUTO_INCREMENT,
  user_id mediumint unsigned NOT NULL UNIQUE,
  product_id mediumint unsigned NOT NULL UNIQUE,
  price smallint unsigned NOT NULL,
  amount smallint unsigned NOT NULL,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  phone char(10),
  address varchar(255),
  order_num char(16),
  status tinyint unsigned DEFAULT 0,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  primary key (id),
  FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE miaosha_orders (
	id smallint unsigned NOT NULL UNIQUE auto_increment,
  user_id mediumint unsigned NOT NULL UNIQUE,
  miaosha_id mediumint unsigned NOT NULL,
  price smallint unsigned NOT NULL,
  amount smallint unsigned DEFAULT 1,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  phone char(10),
  address varchar(255),
  order_num char(16),
  status tinyint unsigned DEFAULT 0,
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  primary key (id),
  FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(miaosha_id) REFERENCES miaosha_product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
