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
