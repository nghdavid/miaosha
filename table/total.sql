CREATE TABLE user (
	id mediumint unsigned NOT NULL UNIQUE auto_increment,
  email varchar(50) NOT NULL UNIQUE,
  password char(60),
  name varchar(20) NOT NULL,
  role_id boolean NOT NULL default 0,
  primary key (id)
);

CREATE TABLE product (
    id mediumint unsigned NOT NULL UNIQUE AUTO_INCREMENT,
    name varchar(16) UNIQUE NOT NULL,
    image varchar(50),
    detail varchar(255),
    price smallint unsigned NOT NULL,
    stock smallint unsigned default 0,
    PRIMARY KEY (id)
);

CREATE TABLE miaosha_product (
    id mediumint unsigned NOT NULL UNIQUE AUTO_INCREMENT,
    product_id mediumint unsigned NOT NULL UNIQUE,
    start_time DATETIME,
    end_time DATETIME,
    price smallint unsigned NOT NULL,
    stock smallint unsigned default 0,
    PRIMARY KEY (id),
    FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE orders (
  id smallint unsigned NOT NULL UNIQUE AUTO_INCREMENT,
  user_id mediumint unsigned NOT NULL UNIQUE,
  product_id mediumint unsigned NOT NULL UNIQUE,
  price smallint unsigned NOT NULL,
  amount smallint unsigned NOT NULL,
  status tinyint unsigned DEFAULT 0,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  phone char(10),
  address varchar(255), 
  primary key (id),
  FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(product_id) REFERENCES product(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE miaosha_orders (
	id smallint unsigned NOT NULL UNIQUE auto_increment,
  user_id mediumint unsigned NOT NULL UNIQUE,
  miaosha_id mediumint unsigned NOT NULL UNIQUE,
  price smallint unsigned NOT NULL,
  amount smallint unsigned DEFAULT 1,
  status tinyint unsigned DEFAULT 0,
  name varchar(20) NOT NULL,
  email varchar(50) NOT NULL,
  phone char(10),
  address varchar(255), 
  primary key (id),
  FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY(miaosha_id) REFERENCES miaosha_product(id) ON DELETE CASCADE ON UPDATE CASCADE
);
